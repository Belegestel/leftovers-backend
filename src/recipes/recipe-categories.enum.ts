import { InternalServerErrorException } from "@nestjs/common";
import { RecipeCategory as PrismaCategory } from "../generated/prisma/client";

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
    throw new InternalServerErrorException("Unknown recipe category");
  }
  return recipeCategory;
}
export function prismaFromCategory(category: RecipeCategory): PrismaCategory {
  return PrismaCategory[category];
}
export const allRecipeCategories = [
  "🥪 breakfasts",
  "🍲 soups",
  "🍔 lunch",
  "🥐 baking",
  "🧁 desserts",
  "🍹 drinks",
  "🍿 snacks",
  "🥗 salads",
];
