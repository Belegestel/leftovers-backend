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
  imageKey: string;

  static from(dto: CreateRecipeRequest): CreateRecipe {
    return {
      title: dto.title,
      description: dto.description,
      category: dto.category,
      prepTime: dto.prepTime,
      servings: dto.servings,
      ingredients: dto.ingredients,
      steps: dto.steps,
      imageKey: dto.imageKey,
    };
  }
}
