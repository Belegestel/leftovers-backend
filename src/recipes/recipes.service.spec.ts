import { Test, TestingModule } from "@nestjs/testing";
import { RecipesService } from "./recipes.service";
import { RecipesRepository } from "./recipes.repository";
import { mockRecipesRepository } from "../../test/unit/mocks/mockRecipesRepository";
import { CreateRecipe } from "./dto/createRecipe.dto";
import { RecipeCategory } from "./recipe-categories.enum";
import { Recipe } from "./recipes.model";
import { CreateRecipeResult } from "./dto/createRecipeResult.dto";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import { FilesService } from "../files/files.service";
import { mockFilesService } from "../../test/unit/mocks/mockFilesService";

describe("RecipesService", () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: RecipesRepository, useValue: mockRecipesRepository },
        { provide: FilesService, useValue: mockFilesService },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("returns only public recipes for guests", async () => {
      const repoResult: Recipe = {
        id: 123,
        title: "Pizza",
        description: "TastyPizza",
        category: RecipeCategory.ITALIAN,
        prepTime: 30,
        servings: 2,
        ingredients: ["Flour", "Water"],
        steps: ["mix", "bake"],
        isPublic: true,
        createdAt: new Date(),
        editedAt: new Date(),
        rating: 1,
        authorId: 1,
        imageKey: undefined,
      };
      mockRecipesRepository.findAll.mockResolvedValue([repoResult]);
      await service.findAll();

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ userId: undefined }),
      );
    });

    it("returns public recipes and own private recipes for logged in users", async () => {
      const repoResult: Recipe = {
        id: 123,
        title: "Pizza",
        description: "TastyPizza",
        category: RecipeCategory.ITALIAN,
        prepTime: 30,
        servings: 2,
        ingredients: ["Flour", "Water"],
        steps: ["mix", "bake"],
        isPublic: true,
        createdAt: new Date(),
        editedAt: new Date(),
        rating: 1,
        authorId: 1,
        imageKey: undefined,
      };
      mockRecipesRepository.findAll.mockResolvedValue([repoResult]);
      await service.findAll(1);

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ userId: 1 }),
      );
    });

    it("applies category filtering", async () => {
      const repoResult: Recipe = {
        id: 123,
        title: "Pizza",
        description: "TastyPizza",
        category: RecipeCategory.ITALIAN,
        prepTime: 30,
        servings: 2,
        ingredients: ["Flour", "Water"],
        steps: ["mix", "bake"],
        isPublic: true,
        createdAt: new Date(),
        editedAt: new Date(),
        rating: 1,
        authorId: 1,
        imageKey: undefined,
      };
      mockRecipesRepository.findAll.mockResolvedValue([repoResult]);
      await service.findAll(undefined, {
        category: "Dessert,Dinner",
      } as RecipeQueryRequest);

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ category: "Dessert,Dinner" }),
      );
    });

    it("applies rating filter", async () => {
      const repoResult: Recipe = {
        id: 123,
        title: "Pizza",
        description: "TastyPizza",
        category: RecipeCategory.ITALIAN,
        prepTime: 30,
        servings: 2,
        ingredients: ["Flour", "Water"],
        steps: ["mix", "bake"],
        isPublic: true,
        createdAt: new Date(),
        editedAt: new Date(),
        rating: 1,
        authorId: 1,
        imageKey: undefined,
      };
      mockRecipesRepository.findAll.mockResolvedValue([repoResult]);
      await service.findAll(undefined, {
        rating: 4,
      });

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ rating: 4 }),
      );
    });

    it("applies title search", async () => {
      const repoResult: Recipe = {
        id: 123,
        title: "Pizza",
        description: "TastyPizza",
        category: RecipeCategory.ITALIAN,
        prepTime: 30,
        servings: 2,
        ingredients: ["Flour", "Water"],
        steps: ["mix", "bake"],
        isPublic: true,
        createdAt: new Date(),
        editedAt: new Date(),
        rating: 1,
        authorId: 1,
        imageKey: undefined,
      };
      mockRecipesRepository.findAll.mockResolvedValue([repoResult]);
      await service.findAll(undefined, {
        title: "cake",
      } as RecipeQueryRequest);

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ title: "cake" }),
      );
    });

    it("applies multiple search conditions", async () => {
      const repoResult: Recipe = {
        id: 123,
        title: "Pizza",
        description: "TastyPizza",
        category: RecipeCategory.ITALIAN,
        prepTime: 30,
        servings: 2,
        ingredients: ["Flour", "Water"],
        steps: ["mix", "bake"],
        isPublic: true,
        createdAt: new Date(),
        editedAt: new Date(),
        rating: 1,
        authorId: 1,
        imageKey: undefined,
      };
      mockRecipesRepository.findAll.mockResolvedValue([repoResult]);
      await service.findAll(undefined, {
        title: "cake",
        ingredients: "flour",
      } as RecipeQueryRequest);

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ title: "cake", ingredients: "flour" }),
      );
    });

    it("creates a recipe via repository and returns a result", async () => {
      const dto: CreateRecipe = {
        title: "Pizza",
        description: "TastyPizza",
        category: RecipeCategory.ITALIAN,
        prepTime: 30,
        servings: 2,
        ingredients: ["Flour", "Water"],
        steps: ["mix", "bake"],
      };
      const repoResult: Recipe = {
        id: 123,
        title: "Pizza",
        description: "TastyPizza",
        category: RecipeCategory.ITALIAN,
        prepTime: 30,
        servings: 2,
        ingredients: ["Flour", "Water"],
        steps: ["mix", "bake"],
        isPublic: true,
        createdAt: new Date(),
        editedAt: new Date(),
        rating: 1,
        authorId: 1,
        imageKey: undefined,
      };

      mockRecipesRepository.create.mockResolvedValue(repoResult);
      const result = await service.createRecipe(1, dto);
      expect(mockRecipesRepository.create).toHaveBeenCalledWith(
        "Pizza",
        "TastyPizza",
        RecipeCategory.ITALIAN,
        30,
        2,
        ["Flour", "Water"],
        ["mix", "bake"],
        1,
      );
      expect(result).toEqual(CreateRecipeResult.from(repoResult));
    });
  });

  it("throws NotFoundException when recipe does not exist", async () => {
    mockRecipesRepository.findById.mockResolvedValue(null);
    await expect(service.findById(1, 1)).rejects.toThrow("Recipe not found");
  });

  it("throws ForbiddenException when accesing another user's private recipe", async () => {
    mockRecipesRepository.findById.mockResolvedValue({
      id: 1,
      isPublic: false,
      authorId: 2,
    });
    await expect(service.findById(1, 1)).rejects.toThrow(
      "You do not have access to this recipe",
    );
  });

  it("returns a public recipe for a guest", async () => {
    mockRecipesRepository.findById.mockResolvedValue({
      id: 1,
      isPublic: true,
      authorId: 2,
    });
    const result = await service.findById(1, undefined);
    expect(result).toEqual({ id: 1, isPublic: true, authorId: 2 });
  });

  it("returns a private recipe when the user is the owner", async () => {
    mockRecipesRepository.findById.mockResolvedValue({
      id: 1,
      isPublic: false,
      authorId: 1,
    });
    const result = await service.findById(1, 1);
    expect(result).toEqual({ id: 1, isPublic: false, authorId: 1 });
  });
});
