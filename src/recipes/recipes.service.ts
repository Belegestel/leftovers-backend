import {
  BadRequestException,
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
import { CreateRecipeImageUploadUrl } from "./dto/createRecipeImageUploadUrl.dto";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { RecipeImageUploadUrl } from "./dto/recipeImageUploadUrl.dto";
import {
  allRecipeCategories,
} from "./recipe-categories.enum";
import { BookmarkRecipe } from "./dto/bookmarkRecipe.dto";
import { UnbookmarkRecipe } from "./dto/unbookmarkRecipe.dto";
import { RateRecipe } from "./dto/rateRecipe.dto";
import { EditRecipe } from "./dto/editRecipe.dto";

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
          await (value.imageKey
            ? this.filesService.createPresignedGetUrl(value.imageKey)
            : undefined),
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
      dto.isPublic,
    );
    return CreateRecipeResult.from(recipe);
  }
  async findById(
    id: number,
    userId?: number,
  ): Promise<SingleRecipeQueryResult> {
    const recipe = await this.recipesRepository.findById(id, userId);
    if (!recipe) {
      throw new NotFoundException("Recipe not found");
    }

    const hasAccess =
      recipe.isPublic || (userId !== undefined && recipe.authorId == userId);
    if (!hasAccess) {
      throw new ForbiddenException("You do not have access to this recipe");
    }

    const imageLink = recipe.imageKey
      ? await this.filesService.createPresignedGetUrl(recipe.imageKey)
      : undefined;
    return SingleRecipeQueryResult.from(recipe, imageLink);
  }

  async createRecipeImageUploadUrl(
    dto: CreateRecipeImageUploadUrl,
  ): Promise<RecipeImageUploadUrl> {
    const recipe = await this.recipesRepository.findById(dto.id);
    if (!recipe) {
      throw new NotFoundException("The recipe does not exist");
    }
    if (recipe.authorId !== dto.userId) {
      throw new ForbiddenException("You cannot modify this recipe");
    }
    const ext = path.extname(dto.fileName);
    const uuid = randomUUID();
    const key = `recipes/${dto.id}/${uuid}${ext}`;
    const uploadUrl = await this.filesService.createPresignedUploadUrl(
      key,
      dto.fileType,
    );
    return RecipeImageUploadUrl.from(uploadUrl);
  }

  async confirmReceivedImageUpload(
    id: number,
    userId: number,
    key: string,
  ): Promise<string> {
    const recipe = await this.recipesRepository.findById(id);
    if (!recipe) {
      throw new NotFoundException("The recipe does not exist");
    }
    if (recipe.authorId !== userId) {
      throw new ForbiddenException("You cannot modify this recipe");
    }
    if (!key.startsWith(`recipes/${id}`)) {
      throw new BadRequestException("Invalid image key");
    }
    await this.recipesRepository.updateImageKey(id, key);
    const imageUrl = await this.filesService.createPresignedGetUrl(key);
    return imageUrl;
  }

  async getRecipeCategories(): Promise<string[]> {
    return allRecipeCategories;
  }

  async bookmarkRecipe(dto: BookmarkRecipe): Promise<void> {
    await this.recipesRepository.bookmarkRecipe(dto.recipeId, dto.userId);
  }

  async unbookmarkRecipe(dto: UnbookmarkRecipe): Promise<void> {
    await this.recipesRepository.unbookmarkRecipe(dto.recipeId, dto.userId);
  }

  async rateRecipe(dto: RateRecipe): Promise<void> {
    await this.recipesRepository.rateRecipe(
      dto.recipeId,
      dto.userId,
      dto.value,
    );
  }

  async editRecipe(dto: EditRecipe): Promise<boolean> {
    return await this.recipesRepository.editRecipe(dto);
  }

  async deleteRecipe(recipeId: number, userId: number): Promise<boolean> {
    return await this.recipesRepository.deleteRecipe(recipeId, userId);
  }
}
