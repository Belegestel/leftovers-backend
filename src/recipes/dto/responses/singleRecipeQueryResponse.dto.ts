import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SingleRecipeQueryResult } from "../singleRecipeQueryResult.dto";

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
  category?: string;
  @ApiProperty()
  ingredients: string[];
  @ApiProperty()
  steps: string[];
  @ApiProperty()
  imageLink: string | undefined;

  static from(result: SingleRecipeQueryResult): SingleRecipeQueryResponse {
    return {
      id: result.id,
      title: result.title,
      description: result.description,
      prepTime: result.prepTime,
      isPublic: result.isPublic,
      authorId: result.authorId,
      createdAt: result.createdAt,
      editedAt: result.editedAt,
      rating: result.rating,
      category: result.category,
      ingredients: result.ingredients,
      steps: result.steps,
      imageLink: result.imageLink,
    };
  }
}
