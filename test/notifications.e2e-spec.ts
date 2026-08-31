import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { PrismaService } from "../src/prisma/prisma.service";
import { createUserAndLogin } from "./utils/create-user-and-login";
import { clearDatabase } from "./utils/clear-db";
import { createE2EApp } from "./utils/create-e2e-app";

describe("NotificationsController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userId: number;
  let token: string;
  let notificationId: number;

  beforeAll(async () => {
    const setup = await createE2EApp();

    app = setup.app;
    prisma = setup.prisma;

    const result = await createUserAndLogin(
      app,
      prisma,
      "notifications-test@test.com",
      "password123",
    );

    userId = result.user.id;
    token = result.token;

    const notification = await prisma.notification.create({
      data: {
        type: "RECIPE_EDIT",
        data: {
          recipeTitle: "Pizza",
        },
        userId,
      },
    });

    notificationId = notification.id;
  });

  afterAll(async () => {
    await clearDatabase(prisma);
  });

  describe("GET /notifications", () => {
    it("should return user's notifications", async () => {
      const response = await request(app.getHttpServer())
        .get("/notifications")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject(
        expect.objectContaining({
          notifications: expect.arrayContaining([
            expect.objectContaining({
              id: notificationId,
              variant: "RECIPE_EDIT",
              data: {
                recipeTitle: "Pizza",
              },
              isRead: false,
            }),
          ]),
        }),
      );
    });

    it("should reject unauthenticated requests", async () => {
      await request(app.getHttpServer()).get("/notifications").expect(401);
    });
  });

  describe("POST /notifications/:id", () => {
    it("should mark notification as read", async () => {
      await request(app.getHttpServer())
        .post(`/notifications/${notificationId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const notification = await prisma.notification.findUnique({
        where: {
          id: notificationId,
        },
      });

      expect(notification?.isRead).toBe(true);
    });

    it("should reject unauthenticated requests", async () => {
      await request(app.getHttpServer())
        .post(`/notifications/${notificationId}`)
        .expect(401);
    });
  });
});
