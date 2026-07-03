import { RecipesQueryReturnModel } from "../recipesQueryReturnModel.dto";
import { RecipeQueryResult } from "../recipeQueryResultDto";
import { Recipe } from "src/recipes/recipes.model";
import { ApiProperty } from "@nestjs/swagger";

export class RecipeQueryResponse {
  @ApiProperty({
    type: [RecipesQueryReturnModel],
  })
  recipes: RecipesQueryReturnModel[];

  static from(recipes: RecipeQueryResult, isDetail: boolean) {
    return {
      recipes: recipes.recipes.map((value: Recipe) =>
        RecipesQueryReturnModel.from(value, isDetail),
      ),
    };
  }
}
