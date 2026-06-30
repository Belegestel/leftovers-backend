import { Recipe as PrismaRecipe } from "../generated/prisma/client";

export class Recipe {
  id: number;
  title: string;
  description?: string;
  prep_time?: number;
  isPublic: boolean;
  authorId: number;
  createdAt: Date;
  editedAt: Date;
  rating: number;
  category?: string;
  ingredients: string;
  steps: string;

  static fromPrisma(recipe: PrismaRecipe): Recipe {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description ?? undefined,
      prep_time: recipe.prep_time ?? undefined,
      isPublic: recipe.isPublic,
      authorId: recipe.author_id,
      createdAt: recipe.created_at,
      editedAt: recipe.edited_at,
      rating: recipe.rating,
      category: recipe.category ?? undefined,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    };
  }
}
