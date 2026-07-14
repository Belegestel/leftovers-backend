import { Recipe as PrismaRecipe } from "../generated/prisma/client";
import { RecipeCategory, categoryFromPrisma } from "./recipe-categories.enum";

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
  category?: RecipeCategory;
  ingredients: string[];
  steps: string[];
  imageKey: string | undefined;

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
    rating: number,
    category: RecipeCategory | undefined,
    ingredients: string[],
    steps: string[],
    imageKey: string | undefined,
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
    this.rating = rating;
    if (category) {
      this.category = category;
    }
    this.ingredients = ingredients;
    this.steps = steps;
    if (imageKey) {
      this.imageKey = imageKey;
    }
  }

  static fromPrisma(recipe: PrismaRecipe): Recipe {
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
      recipe.rating,
      categoryFromPrisma(recipe.category),
      recipe.ingredients,
      recipe.steps,
      recipe.imageKey ?? undefined,
      )
  }
}
