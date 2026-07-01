import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import { RecipeWhereInput } from "src/generated/prisma/models";
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
      ? recipeQuery?.category?.split(",").map((c) => c.trim().toUpperCase() as RecipeCategory)
      : undefined;

    const searchConditions: any = [];
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
        ingredients: { contains: recipeQuery.ingredients, mode: "insensitive" },
      });
    }
    if (recipeQuery?.steps) {
      searchConditions.push({
        steps: { contains: recipeQuery.steps, mode: "insensitive" },
      });
    }

    let conditions: RecipeWhereInput[] = [];
    if (userId) {
      conditions.push({ OR: [{ isPublic: true }, { author_id: userId }] });
    } else {
      conditions.push({ isPublic: true });
    }
    if (categoryList?.length) {
      conditions.push({ category: { in: categoryList } });
    }
    if (recipeQuery?.rating) {
      conditions.push({ rating: { gte: recipeQuery.rating } });
    }
    if (recipeQuery?.startDate || recipeQuery?.endDate) {
      conditions.push({
        created_at: { gte: recipeQuery.startDate, lte: recipeQuery.endDate },
      });
    }
    if (searchConditions.length) {
      conditions.push({ OR: searchConditions });
    }

    const result = await this.prisma.recipe.findMany({
      where: {
        AND: conditions,
      },
      orderBy: { created_at: "desc" },
    });
    return result.map(Recipe.fromPrisma);
  }

  async create(
    title: string,
    description: string,
    category: RecipeCategory,
    prep_time: number,
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
        prep_time,
        servings,
        ingredients,
        steps,
        author_id: userId,
      },
    });

    return Recipe.fromPrisma(recipe);
  }
}
