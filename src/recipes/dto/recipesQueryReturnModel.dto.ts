import { Recipe } from "../recipes.model";

export class RecipesQueryReturnModel {
  id: number;
  title: string;
  description?: string;
  prepTime?: number;
  isPublic?: boolean;
  authorId?: number;
  createdAt?: Date;
  editedAt?: Date;
  rating?: number;
  category?: string;
  ingredients?: string;
  steps?: string;

  static from(recipe: Recipe, detailed: boolean): RecipesQueryReturnModel {
    if (!detailed) {
      return {
        id: recipe.id,
        title: recipe.title,
        prepTime: recipe.prepTime,
        rating: recipe.rating
      };
    } else {
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
      };
    }
  }
}
