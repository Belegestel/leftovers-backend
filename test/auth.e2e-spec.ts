import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { randomUUID } from "crypto";

describe("Auth E2E", () => {
  let app: INestApplication;

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
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
});
