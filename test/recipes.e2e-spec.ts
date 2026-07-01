import { INestApplication } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { createE2EApp } from "./utils/create-e2e-app";
import { clearDatabase } from "./utils/clear-db";
import { createUserAndLogin } from "./utils/create-user-and-login";
import { randomUUID } from "crypto";
import request from "supertest";
import { RecipeCategory } from "../src/recipes/recipe-categories.enum";

describe("Recipes E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const setup = await createE2EApp();
    app = setup.app;
    prisma = setup.prisma;
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /recipes should only return public recipes for guests", async () => {
    const user = await createUserAndLogin(
      app,
      prisma,
      `user${randomUUID()}@email.com`,
      "password123",
    );

    const res = await prisma.recipe.createMany({
      data: [
        {
          title: "Public recipe",
          ingredients: ["a"],
          steps: ["b"],
          rating: 5,
          isPublic: true,
          author_id: user.user.id,
          servings: 1,
          category: RecipeCategory.ITALIAN,
        },
        {
          title: "Private recipe",
          ingredients: ["c"],
          steps: ["d"],
          rating: 4,
          isPublic: false,
          author_id: user.user.id,
          servings: 2,
          category: RecipeCategory.ASIAN,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get("/recipes")
      .expect(200);
    expect(response.body.recipes).toHaveLength(1);
    expect(response.body.recipes[0].title).toBe("Public recipe");
  });

  it("GET /recipes should return public and own private recipes for a logged in user", async () => {
    const userA = await createUserAndLogin(
      app,
      prisma,
      `user${randomUUID()}@email.com`,
      "password123",
    );
    const userB = await createUserAndLogin(
      app,
      prisma,
      `user${randomUUID()}@email.com`,
      "password123",
    );
    await prisma.recipe.createMany({
      data: [
        {
          title: "Public recipe",
          ingredients: ["a"],
          steps: ["b"],
          rating: 5,
          isPublic: true,
          author_id: userA.user.id,
          servings: 1,
          category: RecipeCategory.ITALIAN,
        },
        {
          title: "Private recipe",
          ingredients: ["c"],
          steps: ["d"],
          rating: 4,
          isPublic: false,
          author_id: userA.user.id,
          servings: 2,
          category: RecipeCategory.ASIAN,
        },
        {
          title: "Another private recipe",
          ingredients: ["e"],
          steps: ["f"],
          rating: 3,
          isPublic: false,
          author_id: userB.user.id,
          servings: 2,
          category: RecipeCategory.ASIAN,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get("/recipes")
      .set("Authorization", `Bearer ${userA.token}`)
      .expect(200);

    const titles = response.body.recipes.map((r) => r.title);

    expect(titles).toContain("Public recipe");
    expect(titles).toContain("Private recipe");
    expect(titles).not.toContain("Another private recipe");
  });

  it("GET /recipes should not expose other user's private recipes", async () => {
    const userA = await createUserAndLogin(
      app,
      prisma,
      `user${randomUUID()}@email.com`,
      "password123",
    );
    const userB = await createUserAndLogin(
      app,
      prisma,
      `user${randomUUID()}@email.com`,
      "password123",
    );

    await prisma.recipe.create({
      data: {
        title: "Private recipe",
        ingredients: ["g"],
        steps: ["h"],
        rating: 2,
        isPublic: false,
        author_id: userB.user.id,
        servings: 1,
        category: RecipeCategory.VEGAN,
      },
    });

    const response = await request(app.getHttpServer())
      .get("/recipes")
      .set("Authorization", `Bearer ${userA.token}`)
      .expect(200);

    expect(response.body.recipes).toEqual([]);
  });

  it("GET /recipes?details=true should return detailed DTO", async () => {
    const userA = await createUserAndLogin(
      app,
      prisma,
      "user@email.com",
      "password123",
    );
    const recipe = await prisma.recipe.create({
      data: {
        title: "Public recipe",
        ingredients: ["i"],
        steps: ["j"],
        rating: 1,
        isPublic: true,
        author_id: userA.user.id,
        description: "desc",
        servings: 8,
        category: RecipeCategory.OTHER,
      },
    });

    const response = await request(app.getHttpServer())
      .get("/recipes?details=true")
      .expect(200);
    expect(response.body.recipes).toEqual([
      expect.objectContaining({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        isPublic: true,
        authorId: userA.user.id,
      }),
    ]);
  });
});
