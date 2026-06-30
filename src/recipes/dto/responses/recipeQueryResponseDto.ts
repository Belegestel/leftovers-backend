import { RecipesQueryReturnModel } from "src/recipes/recipes.mapper";

export class RecipeQueryResponseDto {
  recipes: RecipesQueryReturnModel[];

  static from(r: RecipesQueryReturnModel[]) {
    return {
      recipes: r,
    };
  }
}
