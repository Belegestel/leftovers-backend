import { RecipeCategory } from "src/generated/prisma/enums";
import { Recipe } from "../recipes.model";

export class SingleRecipeQueryResult {
  id: number;
  title: string;
  description?: string;
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
  servings: number;
  ratingCount: number;
  isBookmarked: boolean;
  userRating: number | null;
  isPrivate: boolean | null;

  private constructor(
    id: number,
    title: string,
    description: string | undefined,
    prepTime: number | undefined,
    isPublic: boolean,
    authorId: number,
    createdAt: Date,
    editedAt: Date,
    rating: number,
    category: RecipeCategory | undefined,
    ingredients: string[],
    steps: string[],
    imageLink: string | undefined,
    servings: number,
    ratingCount: number,
    isBookmarked: boolean,
    userRating: number | null,
    isPrivate: boolean | null,
  ) {
    this.id = id;
    this.title = title;
    if (description !== undefined) {
      this.description = description;
    }
    if (prepTime !== undefined) {
      this.prepTime = prepTime;
    }
    this.isPublic = isPublic;
    this.authorId = authorId;
    this.createdAt = createdAt;
    this.editedAt = editedAt;
    this.rating = rating;
    if (category) {
      this.category = category;
    }
    this.ingredients = ingredients;
    this.steps = steps;
    if (imageLink) {
      this.imageLink = imageLink;
    }
    this.servings = servings;
    this.ratingCount = ratingCount;
    this.isBookmarked = isBookmarked;
    this.userRating = userRating;
    if (isPrivate) {
      this.isPrivate = isPrivate;
    }
  }

  static from(
    recipe: Recipe,
    imageLink: string | undefined,
  ): SingleRecipeQueryResult {
    return new SingleRecipeQueryResult(
      recipe.id,
      recipe.title,
      recipe.description,
      recipe.prepTime,
      recipe.isPublic,
      recipe.authorId,
      recipe.createdAt,
      recipe.editedAt,
      recipe.rating,
      recipe.category,
      recipe.ingredients,
      recipe.steps,
      imageLink,
      recipe.servings,
      recipe.ratingCount,
      recipe.isBookmarked,
      recipe.userRating,
      !recipe.isPublic
    );
  }
}
