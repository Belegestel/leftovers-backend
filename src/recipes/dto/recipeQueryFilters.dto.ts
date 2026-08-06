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
    this.userId = userId;
    if (category) {
      this.category = category.split(",").map((c) => categoryFromString(c));
    }
    this.ratingOrderIncr = ratingOrderIncr;
    this.dateOrderIncr = dateOrderIncr;
    this.title = title;
    this.description = description;
    this.ingredients = ingredients;
    this.steps = steps;
    this.details = details;
    this.saved = saved;
    this.authored = authored;
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
