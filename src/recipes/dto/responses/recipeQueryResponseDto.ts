import { RecipesQueryReturnModel } from "src/recipes/recipes.mapper";
import { RecipeQueryResult } from "../recipeQueryResultDto";
import { Recipe } from "src/recipes/recipes.model";

export class RecipeQueryResponse {
  recipes: RecipesQueryReturnModel[];

  static from(recipes: RecipeQueryResult, isDetail: boolean) {
    return {
      recipes: recipes.recipes.map((value: Recipe) =>
        RecipesQueryReturnModel.fromRecipe(value, isDetail),
      ),
    };
  }
}
