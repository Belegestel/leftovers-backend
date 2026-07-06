import { RecipeCategory } from "../recipe-categories.enum";
import { Recipe } from "../recipes.model";

export class CreateRecipeResult {
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
  imageLink: string | undefined;

  static from(recipe: Recipe, imageLink: string | undefined): CreateRecipeResult {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      isPublic: recipe.isPublic,
      authorId: recipe.authorId,
      createdAt: recipe.createdAt,
      editedAt: recipe.editedAt,
      rating: recipe.rating,
      category: recipe.category,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      imageLink: imageLink,
    };
  }
}
