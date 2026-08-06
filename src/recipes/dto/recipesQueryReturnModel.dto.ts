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
  isPublic: boolean;
  @ApiPropertyOptional()
  authorId?: number;
  @ApiPropertyOptional()
  createdAt?: Date;
  @ApiPropertyOptional()
  editedAt?: Date;
  @ApiPropertyOptional()
  rating?: number;
  @ApiPropertyOptional()
  ratingCount?: number;
  @ApiPropertyOptional()
  category?: RecipeCategory;
  @ApiPropertyOptional()
  ingredients?: string[];
  @ApiPropertyOptional()
  servings: number;
  @ApiPropertyOptional()
  steps?: string[];
  @ApiProperty()
  imageLink: string | undefined;
  @ApiProperty()
  isBookmarked: boolean;
  @ApiPropertyOptional()
  isPrivate: boolean;

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
      this.ratingCount = recipe.ratingCount;
      this.servings = recipe.servings;
      this.description = recipe.description;
      this.imageLink = imageLink;
      this.isBookmarked = recipe.isBookmarked;
      this.isPrivate = recipe.isPrivate ?? false;
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
      this.ratingCount = recipe.ratingCount;
      this.category = recipe.category;
      this.servings = recipe.servings;
      this.ingredients = recipe.ingredients;
      this.steps = recipe.steps;
      this.imageLink = imageLink;
      this.isBookmarked = recipe.isBookmarked;
      this.isPrivate = recipe.isPrivate ?? false;
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
