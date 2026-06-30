import { Test, TestingModule } from "@nestjs/testing";
import { RecipesService } from "./recipes.service";
import { mockPrismaService } from "../../test/unit/mocks/mockPrismaService";
import { PrismaService } from "../prisma/prisma.service";
import { RecipesRepository } from "./recipes.repository";

describe("RecipesService", () => {
  let service: RecipesService;
  let prismaMock = mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: PrismaService, useValue: prismaMock },
        RecipesRepository,
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("returns only public recipes for guests", async () => {
      prismaMock.recipe.findMany.mockResolvedValue([]);
      await service.findAll();

      expect(prismaMock.recipe.findMany).toHaveBeenCalledWith({
        where: {
          AND: [{ isPublic: true }],
        },
        orderBy: {
          created_at: "desc",
        },
      });
    });

    it("returns public recipes and own private recipes for logged in users", async () => {
      prismaMock.recipe.findMany.mockResolvedValue([]);

      await service.findAll(1);

      expect(prismaMock.recipe.findMany).toHaveBeenCalledWith({
        where: {
          AND: [{ OR: [{ isPublic: true }, { author_id: 1 }] }],
        },
        orderBy: {
          created_at: "desc",
        },
      });
    });

    it("applies category filtering", async () => {
      prismaMock.recipe.findMany.mockResolvedValue([]);
      await service.findAll(undefined, {
        category: "Dessert,Dinner",
      } as any);

      expect(prismaMock.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: expect.arrayContaining([
              {
                category: {
                  in: ["Dessert", "Dinner"],
                },
              },
            ]),
          },
        }),
      );
    });

    it("applies rating filter", async () => {
      prismaMock.recipe.findMany.mockResolvedValue([]);
      await service.findAll(undefined, {
        rating: 4,
      });

      expect(prismaMock.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { AND: expect.arrayContaining([{ rating: { gte: 4 } }]) },
        }),
      );
    });

    it("applies title search", async () => {
      prismaMock.recipe.findMany.mockResolvedValue([]);
      await service.findAll(undefined, {
        title: "cake",
      } as any);

      expect(prismaMock.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: expect.arrayContaining([
              { OR: [{ title: { contains: "cake", mode: "insensitive" } }] },
            ]),
          },
        }),
      );
    });

    it("applies multiple search conditions", async () => {
      prismaMock.recipe.findMany.mockResolvedValue([]);
      await service.findAll(undefined, {
        title: "cake",
        ingredients: "flour",
      } as any);

      expect(prismaMock.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: expect.arrayContaining([
              {
                OR: [
                  { title: { contains: "cake", mode: "insensitive" } },
                  { ingredients: { contains: "flour", mode: "insensitive" } },
                ],
              },
            ]),
          },
        }),
      );
    });
  });
});
