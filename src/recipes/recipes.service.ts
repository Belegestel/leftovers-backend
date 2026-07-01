import { Injectable } from "@nestjs/common";
import { RecipeQueryResult } from "./dto/recipeQueryResultDto";
import { RecipesRepository } from "./recipes.repository";
import { RecipeQueryFilters } from "./dto/recipeQueryFilters.dto";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";

@Injectable()
export class RecipesService {
  constructor(private recipesRepository: RecipesRepository) {}
  async findAll(userId?: number, filters?: RecipeQueryRequest): Promise<RecipeQueryResult> {
    const input = RecipeQueryFilters.from(userId, filters);
    const result = await this.recipesRepository.findAll(userId, input);
    return RecipeQueryResult.from(result);
  }
}
