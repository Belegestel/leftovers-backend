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
import { BookmarkRecipe } from "./dto/bookmarkRecipe.dto";
import { UnbookmarkRecipe } from "./dto/unbookmarkRecipe.dto";
import { RateRecipe } from "./dto/rateRecipe.dto";
import { EditRecipe } from "./dto/editRecipe.dto";

const createRecipe = (overrides?: Partial<Recipe>): Recipe => {
  return {
    id: 1,
    title: "Pizza",
    description: "TastyPizza",
    category: RecipeCategory.LUNCH,
    prepTime: 30,
    servings: 2,
    ingredients: ["Flour", "Water"],
    steps: ["mix", "bake"],
    isPublic: true,
    ratingCount: 0,
    isBookmarked: false,
    createdAt: new Date(),
    editedAt: new Date(),
    rating: 1,
    authorId: 1,
    imageKey: undefined,
    userRating: 1,
    isPrivate: false,
    ...overrides,
  } as Recipe;
};

describe("RecipesService", () => {
  let service: RecipesService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: RecipesRepository, useValue: mockRecipesRepository },
        { provide: FilesService, useValue: mockFilesService },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  describe("findAll", () => {
    it("returns only public recipes for guests", async () => {
      const repoResult = createRecipe();
      mockRecipesRepository.findAll.mockResolvedValue([repoResult]);
      await service.findAll();

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ userId: undefined }),
      );
    });

    it("returns public recipes and own private recipes for logged in users", async () => {
      const repoResult = createRecipe();
      mockRecipesRepository.findAll.mockResolvedValue([repoResult]);
      await service.findAll(1);

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ userId: 1 }),
      );
    });

    it("applies category filtering", async () => {
      const repoResult = createRecipe();
      mockRecipesRepository.findAll.mockResolvedValue([repoResult]);
      await service.findAll(undefined, {
        category: "LUNCH",
      } as RecipeQueryRequest);

      expect(mockRecipesRepository.findAll).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ category: ["LUNCH"] }),
      );
    });

    it("applies title search", async () => {
      const repoResult = createRecipe();
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
      const repoResult = createRecipe();
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
        category: RecipeCategory.LUNCH,
        prepTime: 30,
        servings: 2,
        ingredients: ["Flour", "Water"],
        steps: ["mix", "bake"],
        isPublic: true,
      };
      const repoResult = createRecipe();

      mockRecipesRepository.create.mockResolvedValue(repoResult);
      const result = await service.createRecipe(1, dto);
      expect(mockRecipesRepository.create).toHaveBeenCalledWith(
        "Pizza",
        "TastyPizza",
        RecipeCategory.LUNCH,
        30,
        2,
        ["Flour", "Water"],
        ["mix", "bake"],
        1,
        true,
      );
      expect(result).toEqual(CreateRecipeResult.from(repoResult));
    });
  });

  it("throws NotFoundException when recipe does not exist", async () => {
    mockRecipesRepository.findById.mockResolvedValue(null);
    await expect(service.findById(1, 1)).rejects.toThrow("Recipe not found");
  });

  it("throws ForbiddenException when accesing another user's private recipe", async () => {
    mockRecipesRepository.findById.mockResolvedValue(
      createRecipe({ authorId: 2, isPublic: false }),
    );
    await expect(service.findById(1, 1)).rejects.toThrow(
      "You do not have access to this recipe",
    );
  });

  it("returns a public recipe for a guest", async () => {
    mockRecipesRepository.findById.mockResolvedValue(
      createRecipe({ authorId: 2 }),
    );
    const result = await service.findById(1, undefined);
    expect(result).toMatchObject({ id: 1, isPublic: true, authorId: 2 });
  });

  it("returns a private recipe when the user is the owner", async () => {
    mockRecipesRepository.findById.mockResolvedValue(
      createRecipe({ isPublic: false }),
    );
    const result = await service.findById(1, 1);
    expect(result).toMatchObject({ id: 1, isPublic: false, authorId: 1 });
  });

  describe("bookmarkRecipe", () => {
    it("delegates bookmarking a recipe to the repository", async () => {
      const dto: BookmarkRecipe = {
        recipeId: 1,
        userId: 2,
      };

      await service.bookmarkRecipe(dto);

      expect(mockRecipesRepository.bookmarkRecipe).toHaveBeenCalledWith(
        dto.recipeId,
        dto.userId,
      );
    });
  });

  describe("unbookmarkRecipe", () => {
    it("delegates unbookmarking a recipe to the repository", async () => {
      const dto: UnbookmarkRecipe = {
        recipeId: 1,
        userId: 2,
      };

      await service.unbookmarkRecipe(dto);

      expect(mockRecipesRepository.unbookmarkRecipe).toHaveBeenCalledWith(
        dto.recipeId,
        dto.userId,
      );
    });
  });

  describe("rateRecipe", () => {
    it("delegates rating a recipe to the repository", async () => {
      const dto: RateRecipe = {
        recipeId: 1,
        userId: 2,
        value: 5,
      };

      await service.rateRecipe(dto);

      expect(mockRecipesRepository.rateRecipe).toHaveBeenCalledWith(
        dto.recipeId,
        dto.userId,
        dto.value,
      );
    });
  });

  describe("editRecipe", () => {
    it("delegates a recipe edit to the repository", async () => {
      const dto: EditRecipe = { userId: 1, recipeId: 2, isPublic: true };
      await service.editRecipe(dto);
      expect(mockRecipesRepository.editRecipe).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 1, recipeId: 2, isPublic: true }),
      );
    });
  });

  describe("deleteRecipe", () => {
    it("delegates a recipe deletion to the repository", async () => {
      await service.deleteRecipe(0, 1);
      expect(mockRecipesRepository.deleteRecipe).toHaveBeenCalledWith(0, 1);
    });
  });
});
