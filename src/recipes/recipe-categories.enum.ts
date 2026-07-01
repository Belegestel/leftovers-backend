import { RecipeCategory as PrismaCategory } from "../generated/prisma/client";

export enum RecipeCategory {
  ITALIAN = "ITALIAN",
  ASIAN = "ASIAN",
  DESSERT = "DESSERT",
  VEGETARIAN = "VEGETARIAN",
  VEGAN = "VEGAN",
  OTHER = "OTHER",
}
export function categoryFromPrisma(prisma: PrismaCategory): RecipeCategory {
  switch (prisma) {
    case PrismaCategory.ITALIAN:
      return RecipeCategory.ITALIAN;
    case PrismaCategory.ASIAN:
      return RecipeCategory.ASIAN;
    case PrismaCategory.DESSERT:
      return RecipeCategory.DESSERT;
    case PrismaCategory.VEGETARIAN:
      return RecipeCategory.VEGETARIAN;
    case PrismaCategory.VEGAN:
      return RecipeCategory.VEGAN;
    case PrismaCategory.OTHER:
      return RecipeCategory.OTHER;
  }
}
