import { Recipe } from "../../recipes.model";
import { CreateRecipeResult } from "../createRecipeResult.dto";

export class CreateRecipeResponse {
  recipe: Recipe;

  static from(result: CreateRecipeResult): CreateRecipeResponse {
    return {
      recipe: result.recipe,
    };
  }
}
