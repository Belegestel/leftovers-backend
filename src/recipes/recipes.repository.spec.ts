import { Test, TestingModule } from "@nestjs/testing";
import { RecipesRepository } from "./recipes.repository";
import { PrismaService } from "../prisma/prisma.service";
import { RecipesCacheService } from "./recipes-cache.service";
import { mockCacheService } from "../../test/unit/mocks/mockCacheService";
import { RecipeCategory } from "./recipe-categories.enum";
import { mockPrismaService } from "../../test/unit/mocks/mockPrismaService";
import { Recipe } from "./recipes.model";
import { RecipeQueryFilters } from "./dto/recipeQueryFilters.dto";

describe("RecipesRepository", () => {
  let repository: RecipesRepository;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RecipesCacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    repository = module.get<RecipesRepository>(RecipesRepository);
  });

  describe("findAll", () => {
    it("returns recipes from cache when cache hit occurs", async () => {
      const cachedRecipes: Recipe[] = [
        {
          id: 1,
          title: "Cached pizza",
          servings: 1,
          isPublic: false,
          isBookmarked: false,
          authorId: 1,
          editedAt: new Date(Date.now()),
          createdAt: new Date(Date.now()),
          rating: 0,
          ratingCount: 1,
          ingredients: [],
          steps: [],
          imageKey: "key",
          userRating: 0,
          isPrivate: true,
        },
      ];
      mockCacheService.findAll.mockResolvedValue(cachedRecipes);
      const result = await repository.findAll(undefined, {
        page: 0,
        limit: 10,
      } as RecipeQueryFilters);
      expect(result).toEqual(cachedRecipes);
      expect(mockCacheService.findAll).toHaveBeenCalledWith(undefined, {
        page: 0,
        limit: 10,
      });
      expect(mockPrismaService.recipe.findMany).not.toHaveBeenCalled();
    });

    it("fetches from database and stores result when cache misses", async () => {
      mockCacheService.findAll.mockResolvedValue(undefined);

      mockPrismaService.recipe.findMany.mockResolvedValue([
        {
          id: 1,
          title: "Pizza",
          description: "Tasty",
          category: RecipeCategory.LUNCH,
          prepTime: 30,
          servings: 2,
          ingredients: ["Flour"],
          steps: ["Bake"],
          authorId: 1,
          imageKey: undefined,
          ratings: [],
          savedBy: [],
        },
      ]);

      const filters = { page: 0, limit: 10 } as RecipeQueryFilters;

      const result = await repository.findAll(undefined, filters);

      expect(mockPrismaService.recipe.findMany).toHaveBeenCalled();

      expect(mockCacheService.setFindAll).toHaveBeenCalledWith(
        result,
        undefined,
        filters,
      );
    });

    it("filters recipes by category", async () => {
      mockCacheService.findAll.mockResolvedValue(undefined);
      mockPrismaService.recipe.findMany.mockResolvedValue([]);

      await repository.findAll(undefined, {
        category: [RecipeCategory.LUNCH],
        ratingOrderIncr: false,
        dateOrderIncr: true,
        details: false,
      } as RecipeQueryFilters);

      expect(mockPrismaService.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              {
                category: {
                  in: [RecipeCategory.LUNCH],
                },
              },
            ]),
          }),
        }),
      );
    });

    it("returns recipes belonging to user and public recipes for logged in users", async () => {
      mockCacheService.findAll.mockResolvedValue(undefined);
      mockPrismaService.recipe.findMany.mockResolvedValue([]);

      await repository.findAll(10, {} as RecipeQueryFilters);

      expect(mockPrismaService.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              {
                OR: [{ isPublic: true }, { authorId: 10 }],
              },
            ],
          },
        }),
      );
    });
  });

  describe("create", () => {
    it("creates a recipe and invalidates cache", async () => {
      const prismaRecipe = {
        id: 1,
        title: "Pizza",
        description: "Tasty",
        category: RecipeCategory.LUNCH,
        prepTime: 30,
        servings: 2,
        ingredients: [],
        steps: [],
        authorId: 1,
        imageKey: undefined,
      };

      mockPrismaService.recipe.create.mockResolvedValue(prismaRecipe);

      await repository.create(
        "Pizza",
        "Tasty",
        RecipeCategory.LUNCH,
        30,
        2,
        [],
        [],
        1,
        true,
      );

      expect(mockPrismaService.recipe.create).toHaveBeenCalled();
      expect(mockCacheService.invalidateRecipeCache).toHaveBeenCalled();
    });
  });

  describe("bookmarkRecipe", () => {
    it("invalidates user cache after bookmarking", async () => {
      mockPrismaService.recipe.findUnique.mockResolvedValue({
        id: 1,
      });

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 2,
      });

      await repository.bookmarkRecipe(1, 2);

      expect(mockPrismaService.user.update).toHaveBeenCalled();

      expect(mockCacheService.invalidateRecipeCache).toHaveBeenCalledWith(2);
    });

    it("throws when recipe or user does not exist", async () => {
      mockPrismaService.recipe.findUnique.mockResolvedValue(null);

      await expect(repository.bookmarkRecipe(1, 2)).rejects.toThrow(
        "Recipe or user not found!",
      );
    });
  });

  describe("rateRecipe", () => {
    it("updates rating and invalidates cache", async () => {
      await repository.rateRecipe(1, 2, 5);

      expect(mockPrismaService.recipeRating.upsert).toHaveBeenCalled();

      expect(mockCacheService.invalidateRecipeCache).toHaveBeenCalled();
    });
  });

  describe("pagination", () => {
    it("returns the first page of recipes", async () => {
      mockCacheService.findAll.mockResolvedValue(undefined);

      const recipes = [
        {
          id: 1,
          title: "Recipe 1",
          ratings: [],
          savedBy: [],
        },
        {
          id: 2,
          title: "Recipe 2",
          ratings: [],
          savedBy: [],
        },
        {
          id: 3,
          title: "Recipe 3",
          ratings: [],
          savedBy: [],
        },
      ];

      mockPrismaService.recipe.findMany.mockResolvedValue(recipes);

      const filters = {
        page: 0,
        limit: 2,
      } as RecipeQueryFilters;

      const result = await repository.findAll(undefined, filters);

      expect(result).toHaveLength(2);
      expect(result.map((recipe) => recipe.id)).toEqual([1, 2]);
    });
  });

  it("returns the requested page of recipes", async () => {
    mockCacheService.findAll.mockResolvedValue(undefined);

    mockPrismaService.recipe.findMany.mockResolvedValue([
      {
        id: 1,
        title: "Recipe 1",
        ratings: [],
        savedBy: [],
      },
      {
        id: 2,
        title: "Recipe 2",
        ratings: [],
        savedBy: [],
      },
      {
        id: 3,
        title: "Recipe 3",
        ratings: [],
        savedBy: [],
      },
      {
        id: 4,
        title: "Recipe 4",
        ratings: [],
        savedBy: [],
      },
      {
        id: 5,
        title: "Recipe 5",
        ratings: [],
        savedBy: [],
      },
    ]);

    const filters = {
      page: 1,
      limit: 2,
    } as RecipeQueryFilters;

    const result = await repository.findAll(undefined, filters);

    expect(result.map((recipe) => recipe.id)).toEqual([3, 4]);
  });

  it("returns an empty array when the requested page is past the end", async () => {
    mockCacheService.findAll.mockResolvedValue(undefined);

    mockPrismaService.recipe.findMany.mockResolvedValue([
      {
        id: 1,
        title: "Recipe 1",
        ratings: [],
        savedBy: [],
      },
      {
        id: 2,
        title: "Recipe 2",
        ratings: [],
        savedBy: [],
      },
    ]);

    const filters = {
      page: 1,
      limit: 2,
    } as RecipeQueryFilters;

    const result = await repository.findAll(undefined, filters);

    expect(result).toEqual([]);
  });
});
