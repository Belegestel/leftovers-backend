import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SingleRecipeQueryResult } from "../singleRecipeQueryResult.dto";
import {
  categoryFromString,
  RecipeCategory,
} from "../../../recipes/recipe-categories.enum";

export class SingleRecipeQueryResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  prepTime?: number;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  editedAt: Date;

  @ApiProperty()
  rating: number;

  @ApiPropertyOptional()
  category?: RecipeCategory;

  @ApiProperty()
  ingredients: string[];

  @ApiProperty()
  steps: string[];

  @ApiProperty()
  imageLink: string | undefined;

  @ApiProperty()
  servings: number;

  @ApiProperty()
  ratingCount: number;

  @ApiProperty()
  isBookmarked: boolean;

  @ApiProperty()
  userRating: number | null;

  @ApiPropertyOptional()
  isPrivate: boolean | null;

  private constructor(
    id: number,
    title: string,
    description: string | undefined,
    prepTime: number | undefined,
    isPublic: boolean,
    authorId: number,
    createdAt: Date,
    editedAt: Date,
    rating: number,
    category: string | undefined,
    ingredients: string[],
    steps: string[],
    imageLink: string | undefined,
    servings: number,
    ratingCount: number,
    isBookmarked: boolean,
    userRating: number | null,
    isPrivate: boolean | null,
  ) {
    this.id = id;
    this.title = title;
    if (description !== undefined) {
      this.description = description;
    }
    if (prepTime) {
      this.prepTime = prepTime;
    }
    this.isPublic = isPublic;
    this.authorId = authorId;
    this.createdAt = createdAt;
    this.editedAt = editedAt;
    this.rating = rating;
    if (category) {
      this.category = categoryFromString(category);
    }
    this.ingredients = ingredients;
    this.steps = steps;
    if (imageLink) {
      this.imageLink = imageLink;
    }

    this.servings = servings;
    this.ratingCount = ratingCount;
    this.isBookmarked = isBookmarked;
    this.userRating = userRating;

    if (isPrivate) {
      this.isPrivate = isPrivate;
    }
  }

  static from(result: SingleRecipeQueryResult): SingleRecipeQueryResponse {
    return new SingleRecipeQueryResponse(
      result.id,
      result.title,
      result.description,
      result.prepTime,
      result.isPublic,
      result.authorId,
      result.createdAt,
      result.editedAt,
      result.rating,
      result.category,
      result.ingredients,
      result.steps,
      result.imageLink,
      result.servings,
      result.ratingCount,
      result.isBookmarked,
      result.userRating,
      result.isPrivate
    );
  }
}
