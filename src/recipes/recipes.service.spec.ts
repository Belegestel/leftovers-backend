import { Test, TestingModule } from "@nestjs/testing";
import { RecipesService } from "./recipes.service";
import { RecipesRepository } from "./recipes.repository";
import { mockRecipesRepository } from "../../test/unit/mocks/mockRecipesRepository";
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
  });
});
