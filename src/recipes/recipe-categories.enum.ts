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
  switch (prisma) {
    case PrismaCategory.BREAKFAST:
      return RecipeCategory.BREAKFAST;
    case PrismaCategory.SOUPS:
      return RecipeCategory.SOUPS;
    case PrismaCategory.LUNCH:
      return RecipeCategory.LUNCH;
    case PrismaCategory.BAKING:
      return RecipeCategory.BAKING;
    case PrismaCategory.DESSERTS:
      return RecipeCategory.DESSERTS;
    case PrismaCategory.DRINKS:
      return RecipeCategory.DRINKS;
    case PrismaCategory.SNACKS:
      return RecipeCategory.SNACKS;
    case PrismaCategory.SALADS:
      return RecipeCategory.SALADS;
  }
}
export function categoryFromString(category: string): RecipeCategory {
  switch (category.toLowerCase().trim()) {
    case "breakfast":
      return RecipeCategory.BREAKFAST;
    case "soups":
      return RecipeCategory.SOUPS;
    case "lunch":
      return RecipeCategory.LUNCH;
    case "baking":
      return RecipeCategory.BAKING;
    case "desserts":
      return RecipeCategory.DESSERTS;
    case "drinks":
      return RecipeCategory.DRINKS;
    case "snacks":
      return RecipeCategory.SNACKS;
    case "salads":
      return RecipeCategory.SALADS;
    default:
      throw new InternalServerErrorException("Unknown recipe category");
  }
}
export function prismaFromCategory(category: RecipeCategory): PrismaCategory {
  switch (category) {
    case RecipeCategory.BREAKFAST:
      return PrismaCategory.BREAKFAST;
    case RecipeCategory.SOUPS:
      return PrismaCategory.SOUPS;
    case RecipeCategory.LUNCH:
      return PrismaCategory.LUNCH;
    case RecipeCategory.BAKING:
      return PrismaCategory.BAKING;
    case RecipeCategory.DESSERTS:
      return PrismaCategory.DESSERTS;
    case RecipeCategory.DRINKS:
      return PrismaCategory.DRINKS;
    case RecipeCategory.SNACKS:
      return PrismaCategory.SNACKS;
    case RecipeCategory.SALADS:
      return PrismaCategory.SALADS;
  }
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
