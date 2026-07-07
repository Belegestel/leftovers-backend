import { ApiProperty } from "@nestjs/swagger";
import { Recipe } from "../recipes.model";

export class RecipeQueryResult {
  @ApiProperty()
  recipes: Recipe[];
  @ApiProperty()
  imageLinks: (string | undefined)[];

  private constructor(recipes: Recipe[], imageLinks: (string | undefined)[]) {
    this.recipes = recipes;
    this.imageLinks = imageLinks;
  }

  static from(
    recipes: Recipe[],
    imageLinks: (string | undefined)[],
  ): RecipeQueryResult {
    return new RecipeQueryResult(recipes, imageLinks);
  }
}
