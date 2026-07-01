import { Recipe as PrismaRecipe } from "../generated/prisma/client";
import { RecipeCategory, categoryFromPrisma } from "./recipe-categories.enum";

export class Recipe {
  id: number;
  title: string;
  description?: string;
  prep_time?: number;
  servings: number;
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
      prep_time: recipe.prep_time ?? undefined,
      servings: recipe.servings,
      isPublic: recipe.isPublic,
      authorId: recipe.author_id,
      createdAt: recipe.created_at,
      editedAt: recipe.edited_at,
      rating: recipe.rating,
      category: categoryFromPrisma(recipe.category),
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    };
  }
}
