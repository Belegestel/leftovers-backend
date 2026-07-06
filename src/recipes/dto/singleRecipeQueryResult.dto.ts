import { Recipe } from "../recipes.model";

export class SingleRecipeQueryResult {
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
  imageLink: string;

  static from(recipe: Recipe, imageLink: string): SingleRecipeQueryResult {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      prepTime: recipe.prepTime,
      isPublic: recipe.isPublic,
      authorId: recipe.authorId,
      createdAt: recipe.createdAt,
      editedAt: recipe.editedAt,
      rating: recipe.rating,
      category: recipe.category,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      imageLink,
    };
  }
}
