import { InternalServerErrorException } from "@nestjs/common";
import { RecipeCategory as PrismaCategory } from "../generated/prisma/client";
import { SingleCategory } from "./dto/responses/categoriesResponse.dto";

export enum RecipeCategory {
  BREAKFAST = "BREAKFAST",
  SOUPS = "SOUPS",
  LUNCH = "LUNCH",
  BAKING = "BAKING",
  DESSERTS = "DESSERTS",
  DRINKS = "DRINKS",
  SNACKS = "SNACKS",
  SALADS = "SALADS",
}
export function categoryFromPrisma(prisma: PrismaCategory): RecipeCategory {
  return RecipeCategory[prisma];
}

export function categoryFromString(category: string): RecipeCategory {
  const recipeCategory = RecipeCategory[category.trim().toUpperCase()];
  if (!recipeCategory) {
    if (category.trim().toUpperCase() == "BREAKFASTS") {
      return RecipeCategory.BREAKFAST;
    }
    throw new InternalServerErrorException("Unknown recipe category");
  }
  return recipeCategory;
}
export function prismaFromCategory(category: RecipeCategory): PrismaCategory {
  return PrismaCategory[category];
}
export const allRecipeCategories = [
  new SingleCategory("🥪",  "Breakfasts", "BREAKFAST"),
  new SingleCategory("🍲", "Soups", "SOUPS"),
  new SingleCategory("🍔",  "Lunch", "LUNCH"),
  new SingleCategory("🥐",  "Baking", "BAKING"),
  new SingleCategory("🧁",  "Desserts", "DESSERTS"),
  new SingleCategory("🍹",  "Drinks", "DRINKS"),
  new SingleCategory("🍿",  "Snacks", "SNACKS"),
  new SingleCategory("🥗",  "Salads", "SALADS"),
];
