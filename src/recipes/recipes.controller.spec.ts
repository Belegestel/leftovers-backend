import { Test, TestingModule } from "@nestjs/testing";
import { RecipesController } from "./recipes.controller";
import { mockRecipesService } from "../../test/unit/mocks/mockRecipesService";
import { RecipesService } from "./recipes.service";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import { AuthenticatedRequest } from "src/types/authenticated-request.interface";
import { EditRecipeRequest } from "./dto/requests/editRecipeRequest.dto";
import { mockRecipesRepository } from '../../test/unit/mocks/mockRecipesRepository';

describe("RecipesController", () => {
  let controller: RecipesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [{ provide: RecipesService, useValue: mockRecipesService }],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    jest.clearAllMocks();
  });

  it("passes undefined userId for guests", async () => {
    mockRecipesService.findAll.mockResolvedValue({ recipes: [] });
    await controller.findAll(
      {} as AuthenticatedRequest,
      {} as RecipeQueryRequest,
    );
    expect(mockRecipesService.findAll).toHaveBeenCalledWith(undefined, {});
  });

  it("passes userId for authenticated users", async () => {
    mockRecipesService.findAll.mockResolvedValue({ recipes: [] });
    await controller.findAll(
      { user: { userId: 1 } } as AuthenticatedRequest,
      {} as RecipeQueryRequest,
    );
    expect(mockRecipesService.findAll).toHaveBeenCalledWith(
      1,
      {} as RecipeQueryRequest,
    );
  });

  it("returns list DTOs by default", async () => {
    mockRecipesService.findAll.mockResolvedValue({
      recipes: [{ id: 1, title: "Pizza", prepTime: 30 }],
      imageLinks: [undefined],
    });

    const result = await controller.findAll(
      {} as AuthenticatedRequest,
      {} as RecipeQueryRequest,
    );

    expect(result).toEqual({
      recipes: [{ id: 1, title: "Pizza", prepTime: 30 }],
    });
  });

  it("returns details DTOs when details=true", async () => {
    const recipe = {
      id: 1,
      title: "Pizza",
      description: "Classic pizza",
      prepTime: 30,
      isPublic: true,
      createdAt: new Date("2021-01-01"),
      editedAt: new Date("2021-02-02"),
      authorId: 1,
    };

    mockRecipesService.findAll.mockResolvedValue({
      recipes: [recipe],
      imageLinks: [undefined],
    });
    const result = await controller.findAll(
      {} as AuthenticatedRequest,
      { details: true } as RecipeQueryRequest,
    );
    expect(result).toMatchObject({
      recipes: [
        {
          id: 1,
          title: "Pizza",
          description: "Classic pizza",
          prepTime: 30,
          isPublic: true,
          createdAt: new Date("2021-01-01"),
          editedAt: new Date("2021-02-02"),
          authorId: 1,
        },
      ],
    });
  });

  it("passes undefined user ID (guest) for GET /recipes/:id", async () => {
    mockRecipesService.findById.mockResolvedValue({ recipes: [{ id: 1 }] });
    await controller.findById(1, {} as AuthenticatedRequest);
    expect(mockRecipesService.findById).toHaveBeenCalledWith(1, undefined);
  });

  it("passes userID for GET /recipes/:id", async () => {
    mockRecipesService.findById.mockResolvedValue({ recipes: [{ id: 1 }] });
    await controller.findById(1, {
      user: { userId: 2 },
    } as AuthenticatedRequest);
    expect(mockRecipesService.findById).toHaveBeenCalledWith(1, 2);
  });

  it("edits the recipe", async () => {
    await controller.editRecipe(
      1,
      { user: { userId: 2 } } as AuthenticatedRequest,
      { isPublic: false } as EditRecipeRequest,
    );
    expect(mockRecipesService.editRecipe).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 2, recipeId: 1, isPublic: false }),
    );
  });

  it("deletes the recipe", async () => {
    mockRecipesService.deleteRecipe.mockResolvedValue(true);
    await controller.deleteRecipe(
      1,
      { user: { userId: 2 } } as AuthenticatedRequest,
    );
    expect(mockRecipesService.deleteRecipe).toHaveBeenCalledWith(
      1, 2
    );
  });
});
