import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Recipe } from "../recipes.model";

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
  category?: string;
  @ApiPropertyOptional()
  ingredients?: string;
  @ApiPropertyOptional()
  steps?: string;

  static from(recipe: Recipe, detailed: boolean): RecipesQueryReturnModel {
    if (!detailed) {
      return {
        id: recipe.id,
        title: recipe.title,
        prepTime: recipe.prep_time,
      };
    } else {
      return {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        prepTime: recipe.prep_time,
        isPublic: recipe.isPublic,
        createdAt: recipe.createdAt,
        editedAt: recipe.editedAt,
        authorId: recipe.authorId,
      };
    }
  }
}
