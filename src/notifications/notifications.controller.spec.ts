import { Test, TestingModule } from "@nestjs/testing";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { AllNotificationsResponse } from "./dto/responses/allNotificationsResponse.dto";
import { MockNotificationsService } from "../../test/unit/mocks/mockNotificationsService";

describe("NotificationsController", () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: MockNotificationsService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getNotifs", () => {
    it("should return notifications for the authenticated user", async () => {
      const req = {
        user: {
          userId: 123,
        },
      };

      const serviceResult = [
        {
          id: 1,
          type: "RECIPE_CHANGE",
          data: {
            recipeTitle: "Pizza",
          },
          isRead: false,
        },
      ];

      MockNotificationsService.getAllNotifs.mockResolvedValue(serviceResult);

      const result = await controller.getNotifs(req as any);

      expect(MockNotificationsService.getAllNotifs).toHaveBeenCalledTimes(1);
      expect(MockNotificationsService.getAllNotifs).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 123,
        }),
      );

      expect(result).toBeInstanceOf(AllNotificationsResponse);
    });
  });

  describe("markNotifRead", () => {
    it("should mark a notification as read", async () => {
      const req = {
        user: {
          userId: 123,
        },
      };

      MockNotificationsService.markNotifAsRead.mockResolvedValue(undefined);

      await controller.markNotifRead(55, req as any);

      expect(MockNotificationsService.markNotifAsRead).toHaveBeenCalledTimes(1);
      expect(MockNotificationsService.markNotifAsRead).toHaveBeenCalledWith(
        expect.objectContaining({
          notifId: 55,
          userId: 123,
        }),
      );
    });
  });
});
