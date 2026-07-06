import { ApiProperty } from "@nestjs/swagger";
import { Recipe } from "../recipes.model";

export class RecipeQueryResult {
  @ApiProperty()
  recipes: Recipe[];
  @ApiProperty()
  imageLinks: string[];

  static from(recipes: Recipe[], imageLinks: string[]): RecipeQueryResult {
    return {
      recipes,
      imageLinks,
    };
  }
}
