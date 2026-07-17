import { RecipeCategory, categoryFromPrisma } from "./recipe-categories.enum";
import { RecipeRating } from "./recipeRating.model";
import { Prisma, Recipe as PrismaRecipe } from "../generated/prisma/client";

export class Recipe {
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
  ratingCount: number;
  category?: RecipeCategory;
  ingredients: string[];
  steps: string[];
  imageKey: string | undefined;
  isBookmarked: boolean;
  userRating: number | null;
  isPrivate: boolean | undefined;

  private constructor(
    id: number,
    title: string,
    description: string | undefined,
    servings: number,
    prepTime: number | undefined,
    isPublic: boolean,
    authorId: number,
    createdAt: Date,
    editedAt: Date,
    ratings: RecipeRating[],
    category: RecipeCategory | undefined,
    ingredients: string[],
    steps: string[],
    imageKey: string | undefined,
    isBookmarked: boolean,
    userRating: number | null,
    isPrivate: boolean | undefined,
  ) {
    this.id = id;
    this.title = title;
    if (description) {
      this.description = description;
    }
    this.servings = servings;
    if (prepTime) {
      this.prepTime = prepTime;
    }
    this.isPublic = isPublic;
    this.authorId = authorId;
    this.createdAt = createdAt;
    this.editedAt = editedAt;
    this.rating = ratings
      .map((rating) => rating.value / ratings.length)
      .reduce((total, n) => total + n, 0);
    this.ratingCount = ratings.length;
    if (category) {
      this.category = category;
    }
    this.ingredients = ingredients;
    this.steps = steps;
    if (imageKey) {
      this.imageKey = imageKey;
    }
    this.isBookmarked = isBookmarked;
    this.userRating = userRating;

    if (isPrivate) {
      this.isPrivate = isPrivate;
    }
  }

  static fromPrisma(
    recipe:
      | Prisma.RecipeGetPayload<{ include: { ratings: true } }>
      | PrismaRecipe,
    isBookmarked?: boolean,
    userRating?: number | null,
  ): Recipe {
    return new Recipe(
      recipe.id,
      recipe.title,
      recipe.description ?? undefined,
      recipe.servings,
      recipe.prepTime ?? undefined,
      recipe.isPublic,
      recipe.authorId,
      recipe.createdAt,
      recipe.editedAt,
      "ratings" in recipe ? recipe.ratings : [],
      categoryFromPrisma(recipe.category),
      recipe.ingredients,
      recipe.steps,
      recipe.imageKey ?? undefined,
      isBookmarked ?? false,
      userRating ?? null,
      !recipe.isPublic
    );
  }
}
