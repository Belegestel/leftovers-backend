import { RecipeCategory } from "../recipe-categories.enum";
import { CreateRecipeRequest } from "./requests/createRecipeRequest.dto";

export class CreateRecipe {
  title: string;
  description: string;
  category: RecipeCategory;
  prepTime: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  isPublic: boolean;

  private constructor(
    title: string,
    description: string,
    category: RecipeCategory,
    prepTime: number,
    servings: number,
    ingredients: string[],
    steps: string[],
    isPublic: boolean,
  ) {
    this.title = title;
    this.description = description;
    this.category = category;
    this.prepTime = prepTime;
    this.servings = servings;
    this.ingredients = ingredients;
    this.steps = steps;
    this.isPublic = isPublic;
  }

  static from(dto: CreateRecipeRequest): CreateRecipe {
    return new CreateRecipe(
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
