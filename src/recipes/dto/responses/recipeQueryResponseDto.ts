import { RecipesQueryReturnModel } from "src/recipes/recipes.mapper";

export class RecipeQueryResponseDto {
  recipes: RecipesQueryReturnModel[];

  static from(recipesReturnModel: RecipesQueryReturnModel[]) {
    return {
      recipes: recipesReturnModel,
    };
  }
}
