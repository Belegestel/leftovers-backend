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

  it("/auth/register should return 400 for invalid email", async () => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email: "a",
        password: "password",
        name: "John Doe",
      })
      .expect(400);
  });

  it("/auth/register/ should return 400 if the name is missing", async () => {
    await request(app.getHttpServer())
      .post("/auth/register/")
      .send({
        email: `john.doe${randomUUID()}@email.com`,
        password: "password",
      })
      .expect(400);
  });

  it("/auth/login POST should return 401 for wrong password", async () => {
    const email = `john.doe${randomUUID()}@email.com`;
    const password = `password${randomUUID()}`;

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password, name: "John Doe" })
      .expect(200);

    const signupRequest = await prisma.signup_requests.findUnique({
      where: { email },
    });

    await request(app.getHttpServer())
      .post("/auth/confirm-registration")
      .send({ email, token: signupRequest!.token })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: "wrong-password" })
      .expect(401);
  });

  it("/auth/login POST should return 401 for wrong email", async () => {
    const email = `john.doe${randomUUID()}@email.com`;
    const password = `password${randomUUID()}`;

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password, name: "John Doe" })
      .expect(200);

    const signupRequest = await prisma.signup_requests.findUnique({
      where: { email },
    });

    await request(app.getHttpServer())
      .post("/auth/confirm-registration")
      .send({ email, token: signupRequest!.token })
      .expect(201);

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "1" + email, password })
      .expect(401);
  });

  it("/auth/login POST should return 400 for invalid input", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "john.doe[not]email.com" })
      .expect(400);
  });

  it("/auth/register POST should create a signup request", async () => {
    const email = `john.doe${randomUUID()}@email.com`;
    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email,
        password: "password",
        name: "John Doe",
      })
      .expect(200);

    expect(response.body).toEqual({ message: "Confirmation email sent." });
    const signupRequest = await prisma.signup_requests.findUnique({
      where: { email },
    });

    expect(signupRequest).not.toBeNull();
    expect(signupRequest?.email).toBe(email);
    expect(signupRequest?.token).toBeTruthy();
  });

  it("/auth/register POST should reject dupicate email", async () => {
    const email = `john.doe${randomUUID()}@email.com`;

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password: "password", name: "John Doe" })
      .expect(200);
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password: "password", name: "John Doe" })
      .expect(409);
  });

  it("/auth/confirm-registration POST should create user", async () => {
    const email = `john.doe${randomUUID()}@email.com`;
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password: "password", name: "John Doe" })
      .expect(200);

    const signupRequest = await prisma.signup_requests.findUnique({
      where: { email },
    });

    expect(signupRequest).not.toBeNull();

    const response = await request(app.getHttpServer())
      .post("/auth/confirm-registration")
      .send({ email, token: signupRequest!.token })
      .expect(201);

    expect(response).not.toBeNull();
    expect(response.body.email).toBe(email);

    const user = await prisma.users.findUnique({ where: { email } });
    expect(user).not.toBeNull();
  });

  it("/auth/confirm-registration POST should reject invalid token", async () => {
    const email = `john.doe${randomUUID()}@email.com`;

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password: "password", name: "John Doe" })
      .expect(200);

    await request(app.getHttpServer())
      .post("/auth/confirm-registration")
      .send({ email, token: "invalid-token" })
      .expect(400);
  });

  it("/auth/register, /auth/confirm-registration, /auth/login should register the user and log them in", async () => {
    const email = `john.doe${randomUUID()}@email.com`;
    const password = `password${randomUUID()}`;

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password, name: "John Doe" })
      .expect(200);

    const signupRequest = await prisma.signup_requests.findUnique({
      where: { email },
    });

    await request(app.getHttpServer())
      .post("/auth/confirm-registration")
      .send({ email, token: signupRequest!.token })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password })
      .expect(200);

    expect(response.body).toHaveProperty("accessToken");
  });
});
