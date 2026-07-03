import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { RecipeQueryResult } from "./dto/recipeQueryResultDto";
import { RecipesRepository } from "./recipes.repository";
import { RecipeQueryFilters } from "./dto/recipeQueryFilters.dto";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import { SingleRecipeQueryResult } from "./dto/singleRecipeQueryResult.dto";

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

  async findById(id: number, userId?: number): Promise<SingleRecipeQueryResult> {
    const recipe = await this.recipesRepository.findById(id);
    if (!recipe) {
      throw new NotFoundException("Recipe not found");
    }

    const hasAccess =
      recipe.isPublic || (userId !== undefined && recipe.authorId == userId);
    if (!hasAccess) {
      throw new ForbiddenException("You do not have access to this recipe");
    }

    return SingleRecipeQueryResult.from(recipe);
  }
}
