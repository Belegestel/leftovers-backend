import { Recipe as PrismaRecipe } from "../generated/prisma/client";
import { RecipeCategory, categoryFromPrisma } from "./recipe-categories.enum";

export class Recipe {
  id: number;
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  isPublic: boolean;
  authorId: number;
  createdAt: Date;
  editedAt: Date;
  rating: number;
  category?: RecipeCategory;
  ingredients: string[];
  steps: string[];

  static fromPrisma(recipe: PrismaRecipe): Recipe {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description ?? undefined,
      servings: recipe.servings,
      prepTime: recipe.prepTime ?? undefined,
      isPublic: recipe.isPublic,
      authorId: recipe.authorId,
      createdAt: recipe.createdAt,
      editedAt: recipe.editedAt,
      rating: recipe.rating,
      category: categoryFromPrisma(recipe.category),
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    };
  }
}
