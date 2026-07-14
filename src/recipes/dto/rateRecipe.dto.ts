import { RateRecipeRequest } from "./requests/rateRecipeRequest.dto";

export class RateRecipe {
  userId: number;
  recipeId: number;
  value: number;

  private constructor(userId: number, recipeId: number, value: number) {
    this.userId = userId;
    this.recipeId = recipeId;
    this.value = value;
  }

  static from(dto: RateRecipeRequest, userId: number, recipeId: number): RateRecipe {
    return new RateRecipe(userId, recipeId, dto.value);
  }
}
