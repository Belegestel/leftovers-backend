import { CreateRecipeResult } from "../createRecipeResult.dto";
import { RecipeCategory } from "../../recipe-categories.enum";

export class CreateRecipeResponse {
  id: number;
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  isPublic: boolean;
  authorId: number;
  createdAt: Date;
  editedAt: Date;
  rating: number;
  category?: RecipeCategory;
  ingredients: string[];
  steps: string[];
  imageLink: string | undefined;

  static from(result: CreateRecipeResult): CreateRecipeResponse {
    return {
      id: result.id,
      title: result.title,
      description: result.description,
      servings: result.servings,
      prepTime: result.prepTime,
      isPublic: result.isPublic,
      authorId: result.authorId,
      createdAt: result.createdAt,
      editedAt: result.editedAt,
      rating: result.rating,
      category: result.category,
      ingredients: result.ingredients,
      steps: result.steps,
      imageLink: undefined,
    };
  }
}
