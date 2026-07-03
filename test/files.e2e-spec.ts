import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { PrismaService } from "src/prisma/prisma.service";
import { createE2EApp } from "./utils/create-e2e-app";
import { createUserAndLogin } from "./utils/create-user-and-login";
import { randomUUID } from "crypto";

describe("Files E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const setup = await createE2EApp();
    app = setup.app;
    prisma = setup.prisma;
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create a presigned URL for an authenticated user", async () => {
    const { token } = await createUserAndLogin(
      app,
      prisma,
      `john.doe${randomUUID()}@email.com`,
      "password123",
    );

    const dto = {
      fileName: "image.png",
      fileType: "image/png",
      folder: "images",
    };

    const res = await request(app.getHttpServer())
      .post("/files/presigned-url")
      .set("Authorization", `Bearer ${token}`)
      .send(dto)
      .expect(201);

    expect(res.body).toHaveProperty("url");
    expect(res.body).toHaveProperty("key");
    expect(res.body.key).toContain("images");
  });
});
