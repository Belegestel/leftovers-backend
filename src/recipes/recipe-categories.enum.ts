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
export function categoryFromString(category: string): RecipeCategory {
  switch (category.toLowerCase().trim()) {
    case "italian":
      return RecipeCategory.ITALIAN;
    case "asian":
      return RecipeCategory.ASIAN;
    case "dessert":
      return RecipeCategory.DESSERT;
    case "vegetarian":
      return RecipeCategory.VEGETARIAN;
    case "vegan":
      return RecipeCategory.VEGAN;
    default:
      return RecipeCategory.OTHER;
  }
}
export function prismaFromCategory(category: RecipeCategory): PrismaCategory {
  switch (category) {
    case RecipeCategory.ITALIAN:
      return PrismaCategory.ITALIAN;
    case RecipeCategory.ASIAN:
      return PrismaCategory.ASIAN;
    case RecipeCategory.DESSERT:
      return PrismaCategory.DESSERT;
    case RecipeCategory.VEGETARIAN:
      return PrismaCategory.VEGETARIAN;
    case RecipeCategory.VEGAN:
      return PrismaCategory.VEGAN;
    case RecipeCategory.OTHER:
      return PrismaCategory.OTHER;
  }
}
