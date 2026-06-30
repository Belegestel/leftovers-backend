import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RecipeQueryRequestDto } from "./dto/requests/recipeQueryRequest.dto";
import { recipeWhereInput } from "../generated/prisma/models";
import { Recipe } from "./recipes.model";

@Injectable()
export class RecipesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId?: number,
    recipeQuery?: RecipeQueryRequestDto,
  ): Promise<Recipe[]> {
    const categoryList = recipeQuery?.category
      ? recipeQuery?.category?.split(",").map((c) => c.trim())
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

    let conditions: recipeWhereInput[] = [];
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
}
