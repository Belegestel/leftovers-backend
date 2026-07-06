import { RecipesQueryReturnModel } from "../recipesQueryReturnModel.dto";
import { RecipeQueryResult } from "../recipeQueryResultDto";
import { ApiProperty } from "@nestjs/swagger";

export class RecipeQueryResponse {
  @ApiProperty({
    type: [RecipesQueryReturnModel],
  })
  recipes: RecipesQueryReturnModel[];

  static from(
    recipes: RecipeQueryResult,
    isDetail: boolean,
  ): RecipeQueryResponse {
    return {
      recipes: recipes.recipes.map((recipe, index) =>
        RecipesQueryReturnModel.from(
          recipe,
          isDetail,
          recipes.imageLinks[index],
        ),
      ),
    };
  }
}
