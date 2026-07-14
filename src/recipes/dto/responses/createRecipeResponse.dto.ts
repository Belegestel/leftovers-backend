import { CreateRecipeResult } from "../createRecipeResult.dto";
import { RecipeCategory } from "../../recipe-categories.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateRecipeResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  servings: number;

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

  private constructor(
    id: number,
    title: string,
    description: string | undefined,
    servings: number,
    prepTime: number,
    isPublic: boolean,
    authorId: number,
    createdAt: Date,
    editedAt: Date,
    rating: number,
    category: RecipeCategory | undefined,
    ingredients: string[],
    steps: string[],
    imageLink: string | undefined,
  ) {
    this.id = id;
    this.title = title;
    if (description !== undefined) {
      this.description = description;
    }
    this.servings = servings;
    if (prepTime) {
      this.prepTime = prepTime;
    }
    (this.isPublic = isPublic), (this.authorId = authorId);
    this.createdAt = createdAt;
    this.editedAt = editedAt;
    this.rating = rating;
    if (category) {
      this.category = category;
    }
    this.ingredients = ingredients;
    this.steps = steps;
    if (imageLink) {
      this.imageLink = imageLink;
    }
  }

  static from(result: CreateRecipeResult): CreateRecipeResponse {
    return new CreateRecipeResponse(
      result.id,
      result.title,
      result.description,
      result.servings,
      result.prepTime ?? 10,
      result.isPublic,
      result.authorId,
      result.createdAt,
      result.editedAt,
      result.rating,
      result.category,
      result.ingredients,
      result.steps,
      undefined,
    );
  }
}
