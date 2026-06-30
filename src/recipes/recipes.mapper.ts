import { Recipe } from "./recipes.model";

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

  static fromRecipe(recipe: Recipe, detailed: boolean): RecipesQueryReturnModel {
    if (!detailed) {
      return {
        id: recipe.id,
        title: recipe.title,
        prepTime: recipe.prep_time,
      };
    } else {
      return {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        prepTime: recipe.prep_time,
        isPublic: recipe.isPublic,
        createdAt: recipe.createdAt,
        editedAt: recipe.editedAt,
        authorId: recipe.authorId,
      };
    }
  }
}
