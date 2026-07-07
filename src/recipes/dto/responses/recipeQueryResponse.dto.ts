import { RecipesQueryReturnModel } from "../recipesQueryReturnModel.dto";
import { RecipeQueryResult } from "../recipeQueryResultDto";
import { ApiProperty } from "@nestjs/swagger";

export class RecipeQueryResponse {
  @ApiProperty({
    type: [RecipesQueryReturnModel],
  })
  recipes: RecipesQueryReturnModel[];

  private constructor(recipes: RecipeQueryResult, isDetail: boolean) {
    this.recipes = recipes.recipes.map((recipe, index) =>
      RecipesQueryReturnModel.from(recipe, isDetail, recipes.imageLinks[index]),
    );
  }

  static from(
    recipes: RecipeQueryResult,
    isDetail: boolean,
  ): RecipeQueryResponse {
    return new RecipeQueryResponse(recipes, isDetail);
  }
}
