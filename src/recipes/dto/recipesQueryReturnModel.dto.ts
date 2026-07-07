import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Recipe } from "../recipes.model";
import { RecipeCategory } from "../recipe-categories.enum";

export class RecipesQueryReturnModel {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiPropertyOptional()
  prepTime?: number;
  @ApiPropertyOptional()
  isPublic?: boolean;
  @ApiPropertyOptional()
  authorId?: number;
  @ApiPropertyOptional()
  createdAt?: Date;
  @ApiPropertyOptional()
  editedAt?: Date;
  @ApiPropertyOptional()
  rating?: number;
  @ApiPropertyOptional()
  category?: RecipeCategory;
  @ApiPropertyOptional()
  ingredients?: string[];
  @ApiPropertyOptional()
  steps?: string[];
  @ApiProperty()
  imageLink: string | undefined;

  private constructor(
    recipe: Recipe,
    detailed: boolean,
    imageLink: string | undefined,
  ) {
    if (!detailed) {
      this.id = recipe.id;
      this.title = recipe.title;
      this.prepTime = recipe.prepTime;
      this.rating = recipe.rating;
      this.imageLink = imageLink;
    } else {
      this.id = recipe.id;
      this.title = recipe.title;
      this.description = recipe.description;
      this.prepTime = recipe.prepTime;
      this.isPublic = recipe.isPublic;
      this.authorId = recipe.authorId;
      this.createdAt = recipe.createdAt;
      this.editedAt = recipe.editedAt;
      this.rating = recipe.rating;
      this.category = recipe.category;
      this.ingredients = recipe.ingredients;
      this.steps = recipe.steps;
      this.imageLink = imageLink;
    }
  }

  static from(
    recipe: Recipe,
    detailed: boolean,
    imageLink: string | undefined,
  ): RecipesQueryReturnModel {
    return new RecipesQueryReturnModel(recipe, detailed, imageLink);
  }
}
