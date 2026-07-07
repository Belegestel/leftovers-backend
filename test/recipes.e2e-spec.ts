import { INestApplication } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { createE2EApp } from "./utils/create-e2e-app";
import { clearDatabase } from "./utils/clear-db";
import { createUserAndLogin } from "./utils/create-user-and-login";
import { randomUUID } from "node:crypto";
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

    await prisma.recipe.createMany({
      data: [
        {
          title: "Public recipe",
          ingredients: ["a"],
          steps: ["b"],
          rating: 5,
          isPublic: true,
          servings: 1,
          category: RecipeCategory.ITALIAN,
          authorId: user.user.id,
        },
        {
          title: "Private recipe",
          ingredients: ["c"],
          steps: ["d"],
          rating: 4,
          isPublic: false,
          servings: 2,
          category: RecipeCategory.ASIAN,
          authorId: user.user.id,
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
          servings: 1,
          category: RecipeCategory.ITALIAN,
          authorId: userA.user.id,
        },
        {
          title: "Private recipe",
          ingredients: ["c"],
          steps: ["d"],
          rating: 4,
          isPublic: false,
          servings: 2,
          category: RecipeCategory.ASIAN,
          authorId: userA.user.id,
        },
        {
          title: "Another private recipe",
          ingredients: ["e"],
          steps: ["f"],
          rating: 3,
          isPublic: false,
          servings: 2,
          category: RecipeCategory.ASIAN,
          authorId: userB.user.id,
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
        servings: 1,
        category: RecipeCategory.VEGAN,
        authorId: userB.user.id,
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
        authorId: userA.user.id,
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
        rating: 1,
      }),
    ]);
  });

  it("POST /recipes reject unauthentifcated users", async () => {
    const response = await request(app.getHttpServer())
      .post("/recipes")
      .send({
        title: "Pizza",
        description: "Tasty",
        category: RecipeCategory.ITALIAN,
        prepTime: 30,
        servings: 2,
        ingredients: ["flour"],
        steps: ["mix"],
      })
      .expect(401);

    expect(response.body.message).toBeDefined();
  });

  it("POST /recipes should reject invalid payload", async () => {
    const user = await createUserAndLogin(
      app,
      prisma,
      `john.doe${randomUUID()}@email.com`,
      "password123",
    );

    const response = await request(app.getHttpServer())
      .post("/recipes")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        title: "",
        description: "ok",
        category: RecipeCategory.ITALIAN,
        prep_time: 1,
        servings: 0,
        ingredients: [],
        steps: [],
      })
      .expect(400);
    expect(response.body.message).toBeDefined();
  });

  it("POST /recipes should create a recipe", async () => {
    const user = await createUserAndLogin(
      app,
      prisma,
      `john.doe${randomUUID()}@email.com`,
      "password123",
    );
    const payload = {
      title: "Pizza",
      description: "Tasty pizza",
      category: RecipeCategory.ITALIAN,
      prepTime: 30,
      servings: 2,
      ingredients: ["flour", "water"],
      steps: ["mix", "bake"],
    };
    const response = await request(app.getHttpServer())
      .post("/recipes")
      .set("Authorization", `Bearer ${user.token}`)
      .send(payload)
      .expect(201);
    expect(response.body).toMatchObject({
      id: 1,
      title: "Pizza",
      description: "Tasty pizza",
      category: RecipeCategory.ITALIAN,
      prepTime: 30,
      servings: 2,
      ingredients: ["flour", "water"],
      steps: ["mix", "bake"],
    });
    const recipe = await prisma.recipe.findFirst({ where: { title: "Pizza" } });
    expect(recipe).not.toBeNull();
    expect(recipe?.authorId).toBe(user.user.id);
    expect(recipe?.ingredients).toEqual(["flour", "water"]);
  });

  it("GET /recipes/:id returns a public recipe for guests", async () => {
    const user = await createUserAndLogin(
      app,
      prisma,
      `user${randomUUID()}@email.com`,
      "password123",
    );

    const recipe = await prisma.recipe.create({
      data: {
        title: "Public recipe",
        ingredients: ["i"],
        steps: ["j"],
        rating: 1,
        isPublic: true,
        authorId: user.user.id,
        description: "desc",
        servings: 3,
        category: RecipeCategory.OTHER,
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/recipes/${recipe.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: recipe.id,
      title: "Public recipe",
    });
  });

  it("POST /recipes/:id/image-upload-url should return a presigned upload URL for the recipe owner", async () => {
    const user = await createUserAndLogin(
      app,
      prisma,
      `john.doe${randomUUID()}@email.com`,
      "password123",
    );
    const recipe = await prisma.recipe.create({
      data: {
        title: "Pizza",
        ingredients: ["flour"],
        steps: ["mix"],
        rating: 2,
        isPublic: true,
        servings: 2,
        category: RecipeCategory.ITALIAN,
        authorId: user.user.id,
      },
    });

    const response = await request(app.getHttpServer())
      .post(`/recipes/${recipe.id}/image-upload-url`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({ fileName: "pizza.jpg", fileType: "image/jpeg" })
      .expect(200);

    expect(response.body).toMatchObject({
      url: expect.any(String),
      key: expect.stringContaining(`recipes/${recipe.id}/`),
    });
  });

  it("POST /recipes:id/image-upload-url should reject another user's recipe", async () => {
    const owner = await createUserAndLogin(
      app,
      prisma,
      `john.doe${randomUUID()}@email.com`,
      "password123",
    );
    const otherUser = await createUserAndLogin(
      app,
      prisma,
      `john.dont${randomUUID()}@email.com`,
      "password123",
    );
    const recipe = await prisma.recipe.create({
      data: {
        title: "Pizza",
        ingredients: ["flour"],
        steps: ["mix"],
        rating: 2,
        isPublic: true,
        servings: 2,
        category: RecipeCategory.ITALIAN,
        authorId: owner.user.id,
      },
    });
    const response = await request(app.getHttpServer())
      .post(`/recipes/${recipe.id}/image-upload-url`)
      .set("Authorization", `Bearer ${otherUser.token}`)
      .send({ fileName: "pizza.jpg", fileType: "image/jpeg" })
      .expect(403);
    expect(response.body.message).toBe("You cannot modify this recipe");
  });

  it("POST /recipes:id/image-upload-url should reject missing recipe", async () => {
    const user = await createUserAndLogin(
      app,
      prisma,
      `john.doe${randomUUID()}@email.com`,
      "password123",
    );
    await request(app.getHttpServer())
      .post(`/recipes/123/image-upload-url`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({ fileName: "pizza.jpg", fileType: "image/jpeg" })
      .expect(404);
  });

  it("POST /recipes/:id/image-confirm should confirm image upload and save image key", async () => {
    const user = await createUserAndLogin(
      app,
      prisma,
      `john.doe${randomUUID()}@email.com`,
      "password123",
    );
    const recipe = await prisma.recipe.create({
      data: {
        title: "Pizza",
        ingredients: ["flour"],
        steps: ["mix"],
        rating: 2,
        isPublic: true,
        servings: 2,
        category: RecipeCategory.ITALIAN,
        authorId: user.user.id,
      },
    });

    const key = `recipes/${recipe.id}/image.jpg`;

    const response = await request(app.getHttpServer())
      .post(`/recipes/${recipe.id}/image-confirm`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({ key });
    console.log(response.status, response.body);
    console.log({recipeId: recipe.id, key})
    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      imageUrl: expect.any(String),
    });

    const updatedRecipe = await prisma.recipe.findUnique({
      where: { id: recipe.id },
    });
    expect(updatedRecipe?.imageKey).toBe(key);
  });

  it("POST /recipes/:id/image-confirm should reject on invalid image key", async () => {
    const user = await createUserAndLogin(
      app,
      prisma,
      `john.doe${randomUUID()}@email.com`,
      "password123",
    );
    const recipe = await prisma.recipe.create({
      data: {
        title: "Pizza",
        ingredients: ["flour"],
        steps: ["mix"],
        rating: 2,
        isPublic: true,
        servings: 2,
        category: RecipeCategory.ITALIAN,
        authorId: user.user.id,
      },
    });
    await request(app.getHttpServer())
      .post(`/recipes/${recipe.id}/image-confirm`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({ key: "imvalid/path/imgg.jpg" })
      .expect(400);
  });
});
