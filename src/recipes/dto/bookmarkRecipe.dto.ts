export class BookmarkRecipe {
  recipeId: number;
  userId: number;

  private constructor(recipeId: number, userId: number) {
    this.userId = userId;
    this.recipeId = recipeId;
  }

  static from(recipeId: number, userId: number): BookmarkRecipe {
    return new BookmarkRecipe(recipeId, userId);
  }
}
