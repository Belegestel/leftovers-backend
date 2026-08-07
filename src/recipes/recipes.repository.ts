import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RecipeWhereInput } from "../generated/prisma/models";
import { Recipe } from "./recipes.model";
import {
  RecipeCategory,
  categoryFromString,
  prismaFromCategory,
} from "./recipe-categories.enum";
import { RecipeQueryFilters } from "./dto/recipeQueryFilters.dto";
import { Prisma } from "../generated/prisma/client";
import { EditRecipe } from "./dto/editRecipe.dto";
import { RecipesCacheService } from "./recipes-cache.service";

@Injectable()
export class RecipesRepository {
  constructor(
    private prisma: PrismaService,
    private cacheService: RecipesCacheService,
  ) {}

  async findAll(
    userId?: number,
    recipeQuery?: RecipeQueryFilters,
  ): Promise<Recipe[]> {
    const cacheResult = await this.cacheService.findAll(userId, recipeQuery);
    if (cacheResult) {
      return cacheResult;
    }
    const categoryList = recipeQuery?.category?.length
      ? recipeQuery.category.map((c) => categoryFromString(c))
      : undefined;

    const searchConditions: RecipeWhereInput[] = [];

    if (recipeQuery?.description && recipeQuery?.title) {
      searchConditions.push({
        OR: [
          { title: { contains: recipeQuery.title, mode: "insensitive" } },
          {
            description: {
              contains: recipeQuery.description,
              mode: "insensitive",
            },
          },
        ],
      });
    } else {
      if (recipeQuery?.title) {
        searchConditions.push({
          title: { contains: recipeQuery.title, mode: "insensitive" },
        });
      }

      if (recipeQuery?.description) {
        searchConditions.push({
          description: {
            contains: recipeQuery.description,
            mode: "insensitive",
          },
        });
      }
    }

    if (recipeQuery?.ingredients) {
      searchConditions.push({
        ingredients: { hasSome: recipeQuery.ingredients.split(",") },
      });
    }

    if (recipeQuery?.steps) {
      searchConditions.push({
        steps: { hasSome: recipeQuery.steps.split(",") },
      });
    }
    if (recipeQuery?.authored && userId !== undefined) {
      searchConditions.push({
        authorId: userId,
      });
    }

    const conditions: RecipeWhereInput[] = [];
    if (userId) {
      conditions.push({ OR: [{ isPublic: true }, { authorId: userId }] });
    } else {
      conditions.push({ isPublic: true });
    }
    if (categoryList?.length) {
      conditions.push({ category: { in: categoryList } });
    }

    if (categoryList?.length) {
      conditions.push({
        category: { in: categoryList },
      });
    }

    if (searchConditions.length) {
      conditions.push({
        OR: searchConditions,
      });
    }

    const orderBy: Prisma.RecipeOrderByWithRelationInput[] = [];

    if (recipeQuery?.dateOrderIncr !== undefined) {
      orderBy.push({
        createdAt: recipeQuery.dateOrderIncr ? "desc" : "asc",
      });
    }

    const result = await this.prisma.recipe.findMany({
      where: {
        AND: conditions,
      },
      orderBy,
      include: {
        ratings: true,
        savedBy: userId
          ? {
              where: { id: userId },
              select: { id: true },
            }
          : false,
      },
    });

    const resultFiltered = result
      .map((value) =>
        Recipe.fromPrisma(value, userId ? value.savedBy.length > 0 : false),
      )
      .filter((recipe: Recipe) =>
        recipeQuery?.saved === undefined
          ? true
          : recipe.isBookmarked === recipeQuery.saved,
      )
      .sort((a, b) => {
        if (recipeQuery?.ratingOrderIncr !== undefined) {
          return recipeQuery.ratingOrderIncr
            ? a.rating - b.rating
            : b.rating - a.rating;
        }
        return 0;
      });
    this.cacheService.setFindAll(resultFiltered, userId, recipeQuery);
    return resultFiltered;
  }

  async create(
    title: string,
    description: string,
    category: RecipeCategory,
    prepTime: number,
    servings: number,
    ingredients: string[],
    steps: string[],
    userId: number,
    isPublic: boolean,
  ): Promise<Recipe> {
    const recipe = await this.prisma.recipe.create({
      data: {
        title,
        description,
        category: prismaFromCategory(category),
        prepTime,
        servings,
        ingredients,
        steps,
        authorId: userId,
        imageKey: undefined,
        isPublic,
      },
    });
    await this.cacheService.invalidateRecipeCache();
    return Recipe.fromPrisma(recipe);
  }

  async findById(id: number, userId?: number): Promise<Recipe | null> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ratings: {
          select: {
            value: true,
          },
        },
        savedBy: userId
          ? {
              where: { id: userId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!recipe) {
      return null;
    }

    const isBookmarked = userId ? recipe.savedBy.length > 0 : false;

    const userRating = userId
      ? ((
          await this.prisma.recipeRating.findFirst({
            where: {
              recipeId: id,
              userId,
            },
            select: {
              value: true,
            },
          })
        )?.value ?? null)
      : null;

    return Recipe.fromPrisma(recipe, isBookmarked, userRating);
  }

  async updateImageKey(recipeId: number, key: string) {
    const recipe = await this.prisma.recipe.update({
      where: { id: recipeId },
      data: { imageKey: key },
    });
    await this.cacheService.invalidateRecipeCache();
    return recipe ? Recipe.fromPrisma(recipe) : null;
  }

  async bookmarkRecipe(recipeId: number, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { id: true },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!recipe || !user) {
      throw new NotFoundException("Recipe or user not found!");
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { savedRecipes: { connect: { id: recipeId } } },
    });
    await this.cacheService.invalidateRecipeCache(userId);
  }

  async unbookmarkRecipe(recipeId: number, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { id: true },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!recipe || !user) {
      throw new NotFoundException("Recipe or user not found!");
    }
    const result = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        savedRecipes: {
          disconnect: { id: recipeId },
        },
      },
      include: {
        savedRecipes: true,
      },
    });
    await this.cacheService.invalidateRecipeCache(userId);
    return result;
  }

  async getBookmarks(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { savedRecipes: { include: { ratings: true } } },
    });
  }

  async isBookmarked(recipeId: number, userId: number): Promise<boolean> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        savedBy: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!recipe) {
      return false;
    }
    return recipe.savedBy.length > 0;
  }

  async rateRecipe(
    recipeId: number,
    userId: number,
    value: number,
  ): Promise<void> {
    await this.prisma.recipeRating.upsert({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
      create: {
        userId,
        recipeId,
        value,
      },
      update: {
        value,
      },
    });
    this.cacheService.invalidateRecipeCache();
  }

  async editRecipe(dto: EditRecipe): Promise<boolean> {
    const recipe = await this.prisma.recipe.update({
      where: { id: dto.recipeId, authorId: dto.userId },
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        prepTime: dto.prepTime,
        servings: dto.servings,
        ingredients: dto.ingredients,
        steps: dto.steps,
        isPublic: dto.isPublic,
      },
    });
    if (recipe) {
      return true;
    }
    return false;
  }

  async deleteRecipe(recipeId: number, userId: number): Promise<boolean> {
    const recipe = await this.prisma.recipe.delete({
      where: { id: recipeId, authorId: userId },
    });
    return !!recipe;
  }

  async getUsersSaving(recipeId: number): Promise<number[]> {
    const recipe = await this.prisma.recipe.findFirst({
      where: { id: recipeId },
      select: {
        savedBy: {
          select: {
            id: true,
          },
        },
      },
    });
    if (recipe === null) {
      return [];
    }
    return recipe.savedBy.map((user) => user.id);
  }
}
