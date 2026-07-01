import { Injectable } from "@nestjs/common";
import { RecipeQueryResult } from "./dto/recipeQueryResultDto";
import { RecipesRepository } from "./recipes.repository";
import { RecipeQueryFilters } from "./dto/recipeQueryFilters.dto";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import { CreateRecipe } from "./dto/createRecipe.dto";
import { CreateRecipeResult } from "./dto/createRecipeResult.dto";

@Injectable()
export class RecipesService {
  constructor(private recipesRepository: RecipesRepository) {}

  async findAll(
    userId?: number,
    filters?: RecipeQueryRequest,
  ): Promise<RecipeQueryResult> {
    const input = RecipeQueryFilters.from(userId, filters);
    const result = await this.recipesRepository.findAll(userId, input);
    return RecipeQueryResult.from(result);
  }

  async createRecipe(
    userId: number,
    dto: CreateRecipe,
  ): Promise<CreateRecipeResult> {
    const recipe = await this.recipesRepository.create(
      dto.title,
      dto.description,
      dto.category,
      dto.prepTime,
      dto.servings,
      dto.ingredients,
      dto.steps,
      userId,
    );
    return CreateRecipeResult.from(recipe);
  }
}
