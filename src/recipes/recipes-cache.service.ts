import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { Recipe } from "./recipes.model";
import { RecipeQueryFilters } from "./dto/recipeQueryFilters.dto";

@Injectable()
export class RecipesCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  private readonly recipeCacheIndexKey = "recipes:cache:index";

  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs = 200,
  ): Promise<T | undefined> {
    return Promise.race([
      promise,
      new Promise<undefined>((resolve) =>
        setTimeout(() => resolve(undefined), timeoutMs),
      ),
    ]);
  }

  async findAll(
    userId?: number,
    query?: RecipeQueryFilters,
  ): Promise<Recipe[] | undefined> {
    const key = this.getRecipeCacheKey(userId, query);
    return await this.withTimeout(this.cache.get(key));
  }

  async setFindAll(
    value: Recipe[],
    userId?: number,
    query?: RecipeQueryFilters,
  ): Promise<void> {
    const key = this.getRecipeCacheKey(userId, query);
    await this.withTimeout(this.cache.set(key, value));
    await this.updateRecipeKeys(key);
  }

  private async updateRecipeKeys(newKey: string): Promise<void> {
    const currentKeys =
      (await this.withTimeout(
        this.cache.get<string[]>(this.recipeCacheIndexKey),
      )) ?? [];
    if (!currentKeys.includes(newKey)) {
      await this.withTimeout(this.cache.set(this.recipeCacheIndexKey, [newKey, ...currentKeys]));
    }
  }

  async invalidateRecipeCache(userId?: number): Promise<void> {
    const cachedKeys =
      (await this.withTimeout(this.cache.get<string[]>(this.recipeCacheIndexKey))) ?? [];

    const keysToDelete = cachedKeys.filter((key: string) =>
      userId === undefined
        ? key.startsWith("recipes:")
        : key.startsWith(`recipes:${userId}:`),
    );

    await Promise.all(keysToDelete.map((key) => this.withTimeout(this.cache.del(key))));
    const remainingKeys = cachedKeys.filter(
      (key) => !keysToDelete.includes(key),
    );

    await this.withTimeout(this.cache.set(this.recipeCacheIndexKey, remainingKeys));
  }

  private getRecipeCacheKey(
    userId?: number,
    filters?: RecipeQueryFilters,
  ): string {
    return `recipes:${userId ?? "anonymous"}:${JSON.stringify(filters ?? {})}`;
  }
}
