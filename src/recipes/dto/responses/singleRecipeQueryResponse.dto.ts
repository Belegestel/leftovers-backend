import { SingleRecipeQueryResult } from "../singleRecipeQueryResult.dto";

export class SingleRecipeQueryResponse {
  id: number;
  title: string;
  description?: string;
  prepTime?: number;
  isPublic: boolean;
  authorId: number;
  createdAt: Date;
  editedAt: Date;
  rating: number;
  category?: string;
  ingredients: string[];
  steps: string[];
  imageLink: string;

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
