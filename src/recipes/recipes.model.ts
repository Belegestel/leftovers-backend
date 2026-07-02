import { Recipe as PrismaRecipe } from "../generated/prisma/client";

export class Recipe {
  id: number;
  title: string;
  description?: string;
  prepTime?: number;
  isPublic: boolean;
  authorId: number;
  createdAt: Date;
  editedAt: Date;
  rating: number;
  category?: string;
  ingredients: string[];
  steps: string[];

  static fromPrisma(recipe: PrismaRecipe): Recipe {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description ?? undefined,
      prepTime: recipe.prepTime ?? undefined,
      isPublic: recipe.isPublic,
      authorId: recipe.authorId,
      createdAt: recipe.createdAt,
      editedAt: recipe.editedAt,
      rating: recipe.rating,
      category: recipe.category ?? undefined,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    };
  }
}
