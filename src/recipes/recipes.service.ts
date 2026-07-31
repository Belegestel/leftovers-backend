import {
  BadRequestException,
  ForbiddenException,
  Inject,
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
import { allRecipeCategories } from "./recipe-categories.enum";
import { BookmarkRecipe } from "./dto/bookmarkRecipe.dto";
import { UnbookmarkRecipe } from "./dto/unbookmarkRecipe.dto";
import { RateRecipe } from "./dto/rateRecipe.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { Recipe } from "./recipes.model";

@Injectable()
export class RecipesService {
  private readonly recipeCacheKeys = new Set<string>();

  constructor(
    private readonly recipesRepository: RecipesRepository,
    private readonly filesService: FilesService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private getRecipeCacheKey(
    userId?: number,
    filters?: RecipeQueryRequest,
  ): string {
    return `recipes:${userId ?? "anonymous"}:${JSON.stringify(filters ?? {})}`;
  }

  async findAll(
    userId?: number,
    filters?: RecipeQueryRequest,
  ): Promise<RecipeQueryResult> {
    const cacheKey = this.getRecipeCacheKey(userId, filters);

    let result = await this.cacheManager.get<Recipe[]>(cacheKey);

    if (!result) {
      const input = RecipeQueryFilters.from(userId, filters);

      result = await this.recipesRepository.findAll(userId, input);

      await this.cacheManager.set(cacheKey, result);
      this.recipeCacheKeys.add(cacheKey);
    }

    const links = await Promise.all(
      result.map(async (value) =>
        value.imageKey
          ? this.filesService.createPresignedGetUrl(value.imageKey)
          : undefined,
      ),
    );

    return RecipeQueryResult.from(result, links);
  }

  private async invalidateRecipeCache(userId?: number): Promise<void> {
    const keys = Array.from(this.recipeCacheKeys).filter((key) =>
      key.startsWith(userId === undefined ? "recipes:" : `recipes:${userId}:`),
    );
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));

    keys.forEach((key) => this.recipeCacheKeys.delete(key));
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
    await this.invalidateRecipeCache();
    return CreateRecipeResult.from(recipe);
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
    await this.invalidateRecipeCache();
    return imageUrl;
  }

  async getRecipeCategories(): Promise<string[]> {
    return allRecipeCategories;
  }

  async bookmarkRecipe(dto: BookmarkRecipe): Promise<void> {
    await this.recipesRepository.bookmarkRecipe(dto.recipeId, dto.userId);
    await this.invalidateRecipeCache(dto.userId);
  }

  async unbookmarkRecipe(dto: UnbookmarkRecipe): Promise<void> {
    await this.recipesRepository.unbookmarkRecipe(dto.recipeId, dto.userId);
    await this.invalidateRecipeCache(dto.userId);
  }

  async rateRecipe(dto: RateRecipe): Promise<void> {
    await this.recipesRepository.rateRecipe(
      dto.recipeId,
      dto.userId,
      dto.value,
    );
    await this.invalidateRecipeCache();
  }
}
