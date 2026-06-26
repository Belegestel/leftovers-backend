import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RecipeQueryDto } from "./dto/recipe-query.dto";
import { recipeWhereInput } from "../generated/prisma/models";

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}
  async findAll(userId?: number, filters?: RecipeQueryDto) {
    const categoryList = filters?.category
      ? filters?.category?.split(",").map((c) => c.trim())
      : undefined;

    const searchConditions: any = [];
    if (filters?.title) {
      searchConditions.push({
        title: { contains: filters.title, mode: "insensitive" },
      });
    }
    if (filters?.description) {
      searchConditions.push({
        description: { contains: filters.description, mode: "insensitive" },
      });
    }
    if (filters?.ingredients) {
      searchConditions.push({
        ingredients: { contains: filters.ingredients, mode: "insensitive" },
      });
    }
    if (filters?.steps) {
      searchConditions.push({
        steps: { contains: filters.steps, mode: "insensitive" },
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
    if (filters?.rating) {
      conditions.push({ rating: { gte: filters.rating } });
    }
    if (filters?.startDate || filters?.endDate) {
      conditions.push({
        created_at: { gte: filters.startDate, lte: filters.endDate },
      });
    }
    if (searchConditions.length) {
      conditions.push({ OR: searchConditions });
    }

    return this.prisma.recipe.findMany({
      where: {
        AND: conditions,
      },
      orderBy: { created_at: "desc" },
    });
  }
}
