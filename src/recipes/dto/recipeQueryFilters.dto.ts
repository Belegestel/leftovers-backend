import { ApiPropertyOptional } from "@nestjs/swagger";
import { RecipeQueryRequest } from "./requests/recipeQueryRequest.dto";
import { categoryFromString, RecipeCategory } from "../recipe-categories.enum";

export class RecipeQueryFilters {
  @ApiPropertyOptional()
  userId?: number;
  // Filter
  @ApiPropertyOptional()
  category?: RecipeCategory[];

  @ApiPropertyOptional()
  ratingOrderIncr?: boolean;

  @ApiPropertyOptional()
  dateOrderIncr?: boolean;

  // Search
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  ingredients?: string;

  @ApiPropertyOptional()
  steps?: string;

  @ApiPropertyOptional({ example: "true" })
  details?: boolean;

  @ApiPropertyOptional()
  saved?: boolean;

  @ApiPropertyOptional()
  authored?: boolean;

  private constructor(
    userId?: number,
    category?: string,
    ratingOrderIncr?: boolean,
    dateOrderIncr?: boolean,
    title?: string,
    description?: string,
    ingredients?: string,
    steps?: string,
    details?: boolean,
    saved?: boolean,
    authored?: boolean,
  ) {
    if (userId !== undefined) {
      this.userId = userId;
    }
    if (category) {
      this.category = category.split(",").map((c) => categoryFromString(c));
    }
    if (ratingOrderIncr !== undefined) {
      this.ratingOrderIncr = ratingOrderIncr;
    }
    if (dateOrderIncr !== undefined) {
      this.dateOrderIncr = dateOrderIncr;
    }
    if (title !== undefined) {
      this.title = title;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (ingredients !== undefined) {
      this.ingredients = ingredients;
    }
    if (steps !== undefined) {
      this.steps = steps;
    }
    if (details !== undefined) {
      this.details = details;
    }
    if (saved !== undefined) {
      this.saved = saved;
    }
    if(authored !== undefined) {
      this.authored = authored;
    }
  }
  static from(
    userId: number | undefined,
    recipeQueryRequest: RecipeQueryRequest | undefined,
  ): RecipeQueryFilters {
    return new RecipeQueryFilters(
      userId,
      recipeQueryRequest?.category,
      recipeQueryRequest?.ratingOrderIncr,
      recipeQueryRequest?.dateOrderIncr,
      recipeQueryRequest?.title,
      recipeQueryRequest?.description,
      recipeQueryRequest?.ingredients,
      recipeQueryRequest?.steps,
      recipeQueryRequest?.details,
      recipeQueryRequest?.saved,
      recipeQueryRequest?.authored,
    );
  }
}
