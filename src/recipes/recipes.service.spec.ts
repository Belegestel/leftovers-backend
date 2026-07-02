import { Test, TestingModule } from "@nestjs/testing";
import { RecipesService } from "./recipes.service";
import { RecipesRepository } from "./recipes.repository";
import { mockRecipesRepository } from "../../test/unit/mocks/mockRecipesRepository";
import { CreateRecipe } from "./dto/createRecipe.dto";
import { RecipeCategory } from "./recipe-categories.enum";
import { Recipe } from "./recipes.model";
import { CreateRecipeResult } from "./dto/createRecipeResult.dto";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";

describe("RecipesService", () => {
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: RecipesRepository, useValue: mockRecipesRepository },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("returns only public recipes for guests", async () => {
      await service.findAll();

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ userId: undefined }),
      );
    });

    it("returns public recipes and own private recipes for logged in users", async () => {
      await service.findAll(1);

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ userId: 1 }),
      );
    });

    it("applies category filtering", async () => {
      await service.findAll(undefined, {
        category: "Dessert,Dinner",
      } as RecipeQueryRequest);

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ category: "Dessert,Dinner" }),
      );
    });

    it("applies rating filter", async () => {
      await service.findAll(undefined, {
        rating: 4,
      });

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ rating: 4 }),
      );
    });

    it("applies title search", async () => {
      await service.findAll(undefined, {
        title: "cake",
      } as RecipeQueryRequest);

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ title: "cake" }),
      );
    });

    it("applies multiple search conditions", async () => {
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
        prep_time: 30,
        servings: 2,
        ingredients: ["Flour", "Water"],
        steps: ["mix", "bake"],
        isPublic: true,
        createdAt: new Date(),
        editedAt: new Date(),
        rating: 1,
        authorId: 1,
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
});
