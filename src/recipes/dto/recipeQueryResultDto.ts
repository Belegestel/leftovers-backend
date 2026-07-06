import { ApiProperty } from "@nestjs/swagger";
import { Recipe } from "../recipes.model";

export class RecipeQueryResult {
  @ApiProperty()
  recipes: Recipe[];
  @ApiProperty()
  imageLinks: (string | undefined)[];

  static from(recipes: Recipe[], imageLinks: (string | undefined)[]): RecipeQueryResult {
    return {
      recipes,
      imageLinks,
    };
  }
}
