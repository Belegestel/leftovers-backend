import { RecipeCategory } from "../recipe-categories.enum";
import { Recipe } from "../recipes.model";

export class CreateRecipeResult {
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
  ) {
    this.id = id;
    this.title = title;
      this.description = description;
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
  }

  static from(recipe: Recipe): CreateRecipeResult {
    return new CreateRecipeResult(
      recipe.id,
      recipe.title,
      recipe.description,
      recipe.servings,
      recipe.prepTime,
      recipe.isPublic,
      recipe.authorId,
      recipe.createdAt,
      recipe.editedAt,
      recipe.rating,
      recipe.category,
      recipe.ingredients,
      recipe.steps,
    );
  }
}
