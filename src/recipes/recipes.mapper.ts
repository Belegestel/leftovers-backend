import { Recipe } from "./recipes.model";

export class RecipesQueryReturnModel {
  id: number;
  title: string;
  description?: string;
  prepTime?: number;
  isPublic?: boolean;
  authorId?: number;
  createdAt?: Date;
  editedAt?: Date;
  rating?: number;
  category?: string;
  ingredients?: string;
  steps?: string;

  static fromRecipe(r: Recipe, detailed: boolean): RecipesQueryReturnModel {
    if (!detailed) {
      return {
        id: r.id,
        title: r.title,
        prepTime: r.prep_time,
      };
    } else {
      return {
        id: r.id,
        title: r.title,
        description: r.description,
        prepTime: r.prep_time,
        isPublic: r.isPublic,
        createdAt: r.createdAt,
        editedAt: r.editedAt,
        authorId: r.authorId,
      };
    }
  }
}
