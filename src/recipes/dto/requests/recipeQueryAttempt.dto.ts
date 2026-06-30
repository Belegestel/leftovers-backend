import { ApiPropertyOptional } from "@nestjs/swagger";
import { RecipeQueryRequestDto } from "./recipeQueryRequest.dto";

export class RecipeQueryAttemptDto {
  @ApiPropertyOptional()
  userId?: number;
  // Filter
  @ApiPropertyOptional()
  category?: string;

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

  static from(
    userId: number | undefined,
    recipeQueryRequest: RecipeQueryRequestDto | undefined,
  ): RecipeQueryAttemptDto {
    return {
      userId: userId,
      category: recipeQueryRequest?.category,
      rating: recipeQueryRequest?.rating,
      startDate: recipeQueryRequest?.startDate,
      endDate: recipeQueryRequest?.endDate,
      title: recipeQueryRequest?.title,
      description: recipeQueryRequest?.description,
      ingredients: recipeQueryRequest?.ingredients,
      steps: recipeQueryRequest?.steps,
      details: recipeQueryRequest?.details,
    };
  }
}
