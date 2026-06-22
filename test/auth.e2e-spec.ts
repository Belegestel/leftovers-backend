import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { randomUUID } from "node:crypto";
import { clearDatabase } from "./utils/clear-db";
import { PrismaService } from "../src/prisma/prisma.service";
import { createE2EApp } from "./utils/create-e2e-app";

describe("Auth E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const setup = await createE2EApp();
    app = setup.app;
    prisma = setup.prisma;
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  it("/auth/signup POST should create a user", async () => {
    const testEmail = `john.doe${randomUUID()}@email.com`;
    const response = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        email: testEmail,
        password: "password",
        name: "John Doe",
      })
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe(testEmail);
  });

  it("should return 400 for invalid email", async () => {
    await request(app.getHttpServer())
      .post("/auth/signup/")
      .send({
        email: "a",
        password: "password",
        name: "John Doe",
      })
      .expect(400);
  });

  it("should return 400 if the name is missing", async () => {
    await request(app.getHttpServer())
      .post("/auth/signup/")
      .send({
        email: `john.doe${randomUUID()}@email.com`,
        password: "password",
      })
      .expect(400);
  });

  it("/auth/login/ POST should return JWT for valid credentials", async () => {
    const testEmail = `john.doe${randomUUID()}@email.com`;
    const password = "password";
    await request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email: testEmail, password: password, name: "John Doe" })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: testEmail, password: password })
      .expect(200);

    expect(response.body).toHaveProperty("accessToken");
    expect(typeof response.body.accessToken).toBe("string");
  });

  it("/auth/login POST should return 401 for wrong password", async () => {
    const testEmail = `john.doe${randomUUID()}@email.com`;
    const password = "password";
    const differentPassword = password + "123";
    await request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email: testEmail, password: password, name: "John Doe" })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: testEmail, password: differentPassword })
      .expect(401);
  });

  it("/auth/login POST should return 401 for wrong email", async () => {
    const testEmail = `john.doe${randomUUID()}@email.com`;
    const password = "password";
    const missingEmail = "missing@email.com";
    await request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email: testEmail, password: password, name: "John Doe" })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: missingEmail, password: password })
      .expect(401);
  });

  it("/auth/login POST should return 400 for invalid input", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "john.doe[not]email.com" })
      .expect(400);
  });
});
