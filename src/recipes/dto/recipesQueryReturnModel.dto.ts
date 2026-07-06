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
  category?: RecipeCategory;
  @ApiPropertyOptional()
  ingredients?: string[];
  @ApiPropertyOptional()
  steps?: string[];
  @ApiProperty()
  imageLink: string | undefined;

  static from(
    recipe: Recipe,
    detailed: boolean,
    imageLink: string | undefined,
  ): RecipesQueryReturnModel {
    if (!detailed) {
      return {
        id: recipe.id,
        title: recipe.title,
        prepTime: recipe.prepTime,
        rating: recipe.rating,
        imageLink,
      };
    } else {
      return {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        prepTime: recipe.prepTime,
        isPublic: recipe.isPublic,
        authorId: recipe.authorId,
        createdAt: recipe.createdAt,
        editedAt: recipe.editedAt,
        rating: recipe.rating,
        category: recipe.category,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        imageLink,
      };
    }
  }
}
