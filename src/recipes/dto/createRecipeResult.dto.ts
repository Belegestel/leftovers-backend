import { Recipe } from "../recipes.model";

export class CreateRecipeResult {
  recipe: Recipe;

  static from(recipe: Recipe): CreateRecipeResult {
    return {
      recipe,
    };
  }
}
