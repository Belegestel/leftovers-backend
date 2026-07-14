import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import { RecipeWhereInput } from "../generated/prisma/models";
import { Recipe } from "./recipes.model";
import { RecipeCategory, prismaFromCategory } from "./recipe-categories.enum";

@Injectable()
export class RecipesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId?: number,
    recipeQuery?: RecipeQueryRequest,
  ): Promise<Recipe[]> {
    const categoryList = recipeQuery?.category
      ? recipeQuery?.category
          ?.split(",")
          .map((c) => c.trim().toUpperCase() as RecipeCategory)
      : undefined;

    const searchConditions: RecipeWhereInput[] = [];
    if (recipeQuery?.title) {
      searchConditions.push({
        title: { contains: recipeQuery.title, mode: "insensitive" },
      });
    }
    if (recipeQuery?.description) {
      searchConditions.push({
        description: { contains: recipeQuery.description, mode: "insensitive" },
      });
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

    let conditions: RecipeWhereInput[] = [];
    if (userId) {
      conditions.push({ OR: [{ isPublic: true }, { authorId: userId }] });
    } else {
      conditions.push({ isPublic: true });
    }
    if (categoryList?.length) {
      conditions.push({ category: { in: categoryList } });
    }
    if (recipeQuery?.startDate || recipeQuery?.endDate) {
      conditions.push({
        createdAt: { gte: recipeQuery.startDate, lte: recipeQuery.endDate },
      });
    }
    if (searchConditions.length) {
      conditions.push({ OR: searchConditions });
    }

    const result = await this.prisma.recipe.findMany({
      where: {
        AND: conditions,
      },
      orderBy: { createdAt: "desc" },
      include: { ratings: true },
    });
    const result_filtered = result
      .map((value) => Recipe.fromPrisma(value))
      .filter((recipe: Recipe) =>
        recipeQuery?.rating ? recipe.rating >= recipeQuery.rating : true,
      );
    return result_filtered;
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
      },
    });

    return Recipe.fromPrisma(recipe);
  }

  async findById(id: number, userId?: number): Promise<Recipe | null> {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
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
    const isBookmarked = userId ? (recipe?.savedBy?.length ? recipe.savedBy.length > 0 : false ) : false;
    return recipe ? Recipe.fromPrisma(recipe, isBookmarked) : null;
  }

  async updateImageKey(recipeId: number, key: string) {
    const recipe = await this.prisma.recipe.update({
      where: { id: recipeId },
      data: { imageKey: key },
    });
    return recipe ? Recipe.fromPrisma(recipe) : null;
  }

  async bookmarkRecipe(recipeId: number, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { id: true },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: recipeId },
      select: { id: true },
    });
    if (!recipe || !user) {
      throw new NotFoundException("Recipe or user not found!");
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { savedRecipes: { connect: { id: recipeId } } },
    });
  }

  async unbookmarkRecipe(recipeId: number, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { id: true },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: recipeId },
      select: { id: true },
    });
    if (!recipe) {
      throw new NotFoundException("Recipe or user not found!");
    }
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        savedRecipes: {
          disconnect: { id: recipeId },
        },
      },
    });
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
  }
}
