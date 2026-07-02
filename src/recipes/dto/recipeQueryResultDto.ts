import { ApiProperty } from "@nestjs/swagger";
import { Recipe } from "../recipes.model";

export class RecipeQueryResult {
  @ApiProperty()
  recipes: Recipe[]
  
  static from(recipes: Recipe[]): RecipeQueryResult {
    return {
      recipes
    }
  }
}
