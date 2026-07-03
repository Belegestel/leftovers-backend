import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import { RecipeWhereInput } from "src/generated/prisma/models";
import { Recipe } from "./recipes.model";

@Injectable()
export class RecipesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId?: number,
    recipeQuery?: RecipeQueryRequest,
  ): Promise<Recipe[]> {
    const categoryList = recipeQuery?.category
      ? recipeQuery?.category?.split(",").map((c) => c.trim())
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
      conditions.push({ OR: [{ isPublic: true }, { authorId: userId }] });
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
    });
    return result.map(Recipe.fromPrisma);
  }

  async findById(id: number): Promise<Recipe | null> {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    return recipe ? Recipe.fromPrisma(recipe) : null;
  }
}
