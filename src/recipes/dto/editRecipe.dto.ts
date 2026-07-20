import { RecipeCategory } from "../recipe-categories.enum";
import { EditRecipeRequest } from "./requests/editRecipeRequest.dto";

export class EditRecipe {
  recipeId: number;
  userId: number;
  title?: string;
  description?: string;
  category?: RecipeCategory;
  prepTime?: number;
  servings?: number;
  ingredients?: string[];
  steps?: string[];
  isPublic?: boolean;

  private constructor(
    recipeId: number,
    userId: number,
    title?: string,
    description?: string,
    category?: RecipeCategory,
    prepTime?: number,
    servings?: number,
    ingredients?: string[],
    steps?: string[],
    isPublic?: boolean,
  ) {
    this.recipeId = recipeId;
    this.userId = userId;
    if (title !== undefined) {
      this.title = title;
    }
    if (description !== undefined) {
      this.description = description;
    }
    if (category !== undefined) {
      this.category = category;
    }
    if (prepTime !== undefined) {
      this.prepTime = prepTime;
    }
    if (servings !== undefined) {
      this.servings = servings;
    }
    if (ingredients !== undefined) {
      this.ingredients = ingredients;
    }
    if (steps !== undefined) {
      this.steps = steps;
    }
    if (isPublic !== undefined) {
      this.isPublic = isPublic;
    }
  }

  static from(recipeId: number, dto: EditRecipeRequest, userId: number): EditRecipe {
    return new EditRecipe(
      recipeId,
      userId,
      dto.title,
      dto.description,
      dto.category,
      dto.prepTime,
      dto.servings,
      dto.ingredients,
      dto.steps,
      dto.isPublic,
    );
  }
}
