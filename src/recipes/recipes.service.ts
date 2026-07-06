import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { RecipeQueryResult } from "./dto/recipeQueryResultDto";
import { RecipesRepository } from "./recipes.repository";
import { RecipeQueryFilters } from "./dto/recipeQueryFilters.dto";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import { CreateRecipe } from "./dto/createRecipe.dto";
import { CreateRecipeResult } from "./dto/createRecipeResult.dto";
import { SingleRecipeQueryResult } from "./dto/singleRecipeQueryResult.dto";
import { FilesService } from "../files/files.service";

@Injectable()
export class RecipesService {
  constructor(
    private readonly recipesRepository: RecipesRepository,
    private readonly filesService: FilesService,
  ) {}

  async findAll(
    userId?: number,
    filters?: RecipeQueryRequest,
  ): Promise<RecipeQueryResult> {
    const input = RecipeQueryFilters.from(userId, filters);
    const result = await this.recipesRepository.findAll(userId, input);
    const links = await Promise.all(
      result.map(
        async (value) =>
          await this.filesService.createPresignedGetUrl(value.imageKey),
      ),
    );
    return RecipeQueryResult.from(result, links);
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
      dto.imageKey,
    );
    const imageLink = await this.filesService.createPresignedGetUrl(
      recipe.imageKey,
    );
    return CreateRecipeResult.from(recipe, imageLink);
  }
  async findById(
    id: number,
    userId?: number,
  ): Promise<SingleRecipeQueryResult> {
    const recipe = await this.recipesRepository.findById(id);
    if (!recipe) {
      throw new NotFoundException("Recipe not found");
    }

    const hasAccess =
      recipe.isPublic || (userId !== undefined && recipe.authorId == userId);
    if (!hasAccess) {
      throw new ForbiddenException("You do not have access to this recipe");
    }

    const imageLink = await this.filesService.createPresignedGetUrl(
      recipe.imageKey,
    );
    return SingleRecipeQueryResult.from(recipe, imageLink);
  }
}
