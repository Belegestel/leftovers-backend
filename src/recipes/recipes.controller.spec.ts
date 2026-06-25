import { Test, TestingModule } from "@nestjs/testing";
import { RecipesController } from "./recipes.controller";
import { mockRecipesService } from "../../test/unit/mocks/mockRecipesService";
import { RecipesService } from "./recipes.service";
import { RecipeFiltersDto } from "./dto/recipe-filters.dto";

describe("RecipesController", () => {
  let controller: RecipesController;
  const recipesServiceMock = mockRecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [{ provide: RecipesService, useValue: recipesServiceMock }],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    jest.clearAllMocks();
  });

  it("passes undefined userId for guests", async () => {
    recipesServiceMock.findAll.mockResolvedValue([]);
    await controller.findAll({}, {} as RecipeFiltersDto);
    expect(recipesServiceMock.findAll).toHaveBeenCalledWith(undefined, {});
  });

  it("passes userId for authenticated users", async () => {
    recipesServiceMock.findAll.mockResolvedValue([]);
    await controller.findAll({ user: { userId: "1" } }, {} as RecipeFiltersDto);
    expect(recipesServiceMock.findAll).toHaveBeenCalledWith(
      1,
      {} as RecipeFiltersDto,
    );
  });

  it("returns list DTOs by default", async () => {
    recipesServiceMock.findAll.mockResolvedValue([
      { id: 1, title: "Pizza", prep_time: 30 },
    ]);

    const result = await controller.findAll({}, {} as RecipeFiltersDto);

    expect(result).toEqual([{ id: 1, title: "Pizza", prep_time: 30 }]);
  });

  it("returns details DTOs when details=true", async () => {
    const recipe = {
      id: 1,
      title: "Pizza",
      description: "Classic pizza",
      prep_time: 30,
      isPublic: true,
      created_at: new Date("2021-01-01"),
      edited_at: new Date("2021-02-02"),
      author_id: 1,
    };

    recipesServiceMock.findAll.mockResolvedValue([recipe]);
    const result = await controller.findAll({}, {} as RecipeFiltersDto, 'true');
    expect(result).toEqual([recipe]);
  });
});
