import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import type { Cache } from "cache-manager";
import { Recipe } from "./recipes.model";

@Injectable()
export class RecipesCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  private readonly recipeCacheIndexKey = "recipes:cache:index";

  async findAll(
    userId?: number,
    query?: RecipeQueryRequest,
  ): Promise<Recipe[] | undefined> {
    const key = this.getRecipeCacheKey(userId, query);
    return await this.cache.get(key);
  }

  async setFindAll(
    value: Recipe[],
    userId?: number,
    query?: RecipeQueryRequest,
  ): Promise<void> {
    const key = this.getRecipeCacheKey(userId, query);
    await this.cache.set(key, value);
    await this.updateRecipeKeys(key);
  }

  private async updateRecipeKeys(newKey: string): Promise<void> {
    const currentKeys =
      (await this.cache.get<string[]>(this.recipeCacheIndexKey)) ?? [];
    if (!currentKeys.includes(newKey)) {
      await this.cache.set(this.recipeCacheIndexKey, [newKey, ...currentKeys]);
    }
  }

  async invalidateRecipeCache(userId?: number): Promise<void> {
    const cachedKeys =
      (await this.cache.get<string[]>(this.recipeCacheIndexKey)) ?? [];

    const keysToDelete = cachedKeys.filter((key: string) =>
      userId === undefined
        ? key.startsWith("recipes:")
        : key.startsWith(`recipes:${userId}:`),
    );

    await Promise.all(keysToDelete.map((key) => this.cache.del(key)));
    const remainingKeys = cachedKeys.filter(
      (key) => !keysToDelete.includes(key),
    );

    await this.cache.set(this.recipeCacheIndexKey, remainingKeys);
  }

  private getRecipeCacheKey(
    userId?: number,
    filters?: RecipeQueryRequest,
  ): string {
    return `recipes:${userId ?? "anonymous"}:${JSON.stringify(filters ?? {})}`;
  }
}
