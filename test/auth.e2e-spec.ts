import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { randomUUID } from "node:crypto";
import { clearDatabase } from "./utils/clear-db";
import { PrismaService } from "../src/prisma/prisma.service";
import { createE2EApp } from "./utils/create-e2e-app";
import { createUserAndLogin } from "./utils/create-user-and-login";
import { mockEmailService } from "./unit/mocks/mockEmailService";

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
    jest.clearAllMocks();
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
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("/auth/register/ should return 400 if the name is missing", async () => {
    await request(app.getHttpServer())
      .post("/auth/register/")
      .send({
        email: `john.doe${randomUUID()}@email.com`,
        password: "password",
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("/auth/login POST should return 401 for wrong password", async () => {
    const email = `john.doe${randomUUID()}@email.com`;
    const password = `password${randomUUID()}`;

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password, name: "John Doe" })
      .expect(HttpStatus.OK);

    const signupRequest = await prisma.signupRequest.findUnique({
      where: { email },
    });

    await request(app.getHttpServer())
      .post("/auth/confirm-registration")
      .send({ email, token: signupRequest!.token })
      .expect(HttpStatus.CREATED);

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
      .expect(HttpStatus.OK);

    const signupRequest = await prisma.signupRequest.findUnique({
      where: { email },
    });

    await request(app.getHttpServer())
      .post("/auth/confirm-registration")
      .send({ email, token: signupRequest!.token })
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "1" + email, password })
      .expect(401);
  });

  it("/auth/login POST should return 400 for invalid input", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "john.doe[not]email.com" })
      .expect(HttpStatus.BAD_REQUEST);
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
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({ message: "Confirmation email sent." });
    const signupRequest = await prisma.signupRequest.findUnique({
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
      .expect(HttpStatus.OK);
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
      .expect(HttpStatus.OK);

    const signupRequest = await prisma.signupRequest.findUnique({
      where: { email },
    });

    expect(signupRequest).not.toBeNull();

    const response = await request(app.getHttpServer())
      .post("/auth/confirm-registration")
      .send({ email, token: signupRequest!.token })
      .expect(HttpStatus.CREATED);

    expect(response).not.toBeNull();
    expect(response.body.email).toBe(email);

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user).not.toBeNull();
  });

  it("/auth/confirm-registration POST should reject invalid token", async () => {
    const email = `john.doe${randomUUID()}@email.com`;

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password: "password", name: "John Doe" })
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .post("/auth/confirm-registration")
      .send({ email, token: "invalid-token" })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("/auth/register, /auth/confirm-registration, /auth/login should register the user and log them in", async () => {
    const email = `john.doe${randomUUID()}@email.com`;
    const password = `password${randomUUID()}`;

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password, name: "John Doe" })
      .expect(HttpStatus.OK);

    const signupRequest = await prisma.signupRequest.findUnique({
      where: { email },
    });

    await request(app.getHttpServer())
      .post("/auth/confirm-registration")
      .send({ email, token: signupRequest!.token })
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password })
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty("accessToken");
  });

  it("/auth/reset-password POST should create reset request and return 200", async () => {
    const email = `john.doe${randomUUID()}@email.com`;
    const password = `password${randomUUID()}`;
    await createUserAndLogin(app, prisma, email, password);
    const response = await request(app.getHttpServer())
      .post("/auth/reset-password")
      .send({ email })
      .expect(HttpStatus.OK);
    expect(response.body).toEqual({
      message: "If email exists, the message has been sent.",
    });
    const resetRequest = await prisma.passwordResetRequest.findFirst({
      where: { email },
    });
    expect(resetRequest).not.toBeNull();
    expect(resetRequest?.tokenHash).toBeTruthy();
  });

  it("/auth/reset-password POST should return 200 if user does not exist", async () => {
    const email = `john.doe${randomUUID()}@email.com`;
    const response = await request(app.getHttpServer())
      .post("/auth/reset-password")
      .send({ email })
      .expect(HttpStatus.OK);
    expect(response.body).toEqual({
      message: "If email exists, the message has been sent.",
    });
    const resetRequest = await prisma.passwordResetRequest.findFirst({
      where: { email },
    });
    expect(resetRequest).toBeNull();
  });

  it("/auth/reset-password/confirm POST should reset the user's password", async () => {
    const email = `john.doe${randomUUID()}@email.com`;
    const password = "password123";
    const newPassword = "password321";
    await createUserAndLogin(app, prisma, email, password);

    await request(app.getHttpServer())
      .post("/auth/reset-password")
      .send({ email })
      .expect(HttpStatus.OK);

    const resetRequest = await prisma.passwordResetRequest.findFirst({
      where: { email },
    });

    expect(resetRequest).not.toBeNull();

    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2);

    const [, , , context] = mockEmailService.sendEmail.mock.calls[1];
    const resetLink = context.resetLink as string;

    const token = new URL(resetLink).searchParams.get("token");
    expect(token).toBeTruthy();

    await request(app.getHttpServer())
      .post("/auth/reset-password/confirm")
      .send({ token, newPassword })
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: newPassword })
      .expect(HttpStatus.OK);
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: password })
      .expect(401);
  });

  it("/auth/reset-password/confirm POST should reject an invalid token", async () => {
    await request(app.getHttpServer())
      .post("/auth/reset-password/confirm")
      .send({ token: "invalid-token", newPassword: "password321" })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("POST /auth/reset-password/confirm POSt should return 400 for an invalid password", async () => {
    await request(app.getHttpServer())
      .post("/auth/reset-password/confirm")
      .send({ token: "invalid-token", newPassword: "321" })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
