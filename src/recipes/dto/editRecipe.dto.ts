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
      this.title = title;
      this.description = description;
      this.category = category;
      this.prepTime = prepTime;
      this.servings = servings;
      this.ingredients = ingredients;
      this.steps = steps;
      this.isPublic = isPublic;
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
