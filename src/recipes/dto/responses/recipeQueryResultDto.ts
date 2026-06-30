import { ApiProperty } from "@nestjs/swagger";
import { Recipe } from "../../recipes.model";

export class RecipeQueryResultDto {
  @ApiProperty()
  recipes: Recipe[]
  
  static from(recipes: Recipe[]): RecipeQueryResultDto {
    return {
      recipes
    }
  }
}
