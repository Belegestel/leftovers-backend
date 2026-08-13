import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RecipeQueryRequest } from "./requests/recipeQueryRequest.dto";
import { categoryFromString, RecipeCategory } from "../recipe-categories.enum";

export class RecipeQueryFilters {
  @ApiPropertyOptional()
  userId?: number;

  // Pagination

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  // Filter
  @ApiPropertyOptional()
  category?: RecipeCategory[];

  @ApiProperty()
  ratingOrderIncr: boolean;

  @ApiProperty()
  dateOrderIncr: boolean;

  // Search
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  ingredients?: string;

  @ApiPropertyOptional()
  steps?: string;

  @ApiProperty({ example: "true" })
  details: boolean;

  @ApiProperty()
  saved?: boolean;

  @ApiProperty()
  authored?: boolean;

  private constructor(
    page: number,
    limit: number,
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
    this.ratingOrderIncr = ratingOrderIncr ?? false;
    this.dateOrderIncr = dateOrderIncr ?? false;
    this.title = title;
    this.description = description;
    this.ingredients = ingredients;
    this.steps = steps;
    this.details = details ?? false;
    this.saved = saved;
    this.authored = authored;
    this.page = page;
    this.limit = limit;
  }
  static from(
    userId: number | undefined,
    recipeQueryRequest: RecipeQueryRequest | undefined,
  ): RecipeQueryFilters {
    return new RecipeQueryFilters(
      recipeQueryRequest?.page ?? 0,
      recipeQueryRequest?.limit ?? 20,
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
