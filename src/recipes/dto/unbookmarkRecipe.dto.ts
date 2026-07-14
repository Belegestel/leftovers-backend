export class UnbookmarkRecipe {
  recipeId: number;
  userId: number;

  private constructor(recipeId: number, userId: number) {
    this.userId = userId;
    this.recipeId = recipeId;
  }

  static from(recipeId: number, userId: number): UnbookmarkRecipe {
    return new UnbookmarkRecipe(recipeId, userId);
  }
}
