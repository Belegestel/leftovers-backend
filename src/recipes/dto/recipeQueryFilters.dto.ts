import { ApiPropertyOptional } from "@nestjs/swagger";
import { RecipeQueryRequest } from "./requests/recipeQueryRequest.dto";
import { RecipeCategory } from "../recipe-categories.enum";

export class RecipeQueryFilters {
  @ApiPropertyOptional()
  userId?: number;
  // Filter
  @ApiPropertyOptional()
  category?: RecipeCategory;

  @ApiPropertyOptional()
  rating?: number;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

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

  private constructor(
    userId?: number,
    category?: RecipeCategory,
    rating?: number,
    startDate?: Date,
    endDate?: Date,
    title?: string,
    description?: string,
    ingredients?: string,
    steps?: string,
    details?: boolean,
  ) {
    if (userId === undefined) {
      this.userId = userId;
    }
    if (category) {
      this.category = category;
    }
    if (rating === undefined) {
      this.rating = rating;
    }
    if (startDate === undefined) {
      this.startDate = startDate;
    }
    if (endDate === undefined) {
      this.endDate = endDate;
    }
    if (title === undefined) {
      this.title = title;
    }
    if (description === undefined) {
      this.description = description;
    }
    if (ingredients === undefined) {
      this.ingredients = ingredients;
    }
    if (steps === undefined) {
      this.steps = steps;
    }
    if (details === undefined) {
      this.details = details;
    }
  }
  static from(
    userId: number | undefined,
    recipeQueryRequest: RecipeQueryRequest | undefined,
  ): RecipeQueryFilters {
    return new RecipeQueryFilters(
       userId,
       recipeQueryRequest?.category,
       recipeQueryRequest?.rating,
       recipeQueryRequest?.startDate,
       recipeQueryRequest?.endDate,
       recipeQueryRequest?.title,
       recipeQueryRequest?.description,
       recipeQueryRequest?.ingredients,
       recipeQueryRequest?.steps,
       recipeQueryRequest?.details,
    )
  }
}
