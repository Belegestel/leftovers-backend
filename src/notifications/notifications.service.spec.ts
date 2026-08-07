import { Test} from "@nestjs/testing";
import { NotificationsService } from "./notifications.service";
import { NotificationsRepository } from "./notifications.repository";
import { NotificationsGateway } from "./notifications.gateway";
import { MockNotificationsRepository } from "../../test/unit/mocks/mockNotificationsRepository";
import { MockNotificationGateway } from "../../test/unit/mocks/mockNotificationGateway";

describe("NotificationsService", () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NotificationsRepository,
          useValue: MockNotificationsRepository,
        },
        {
          provide: NotificationsGateway,
          useValue: MockNotificationGateway,
        },
      ],
    }).compile();

    service = module.get(NotificationsService);
  });

  it("should get all notifications", async () => {
    MockNotificationsRepository.getAllNotifs.mockResolvedValue([]);

    const result = await service.getAllNotifs({
      userId: 10,
    });

    expect(MockNotificationsRepository.getAllNotifs).toHaveBeenCalledWith(10);
    expect(result).toBeDefined();
  });

  it("should mark notification as read", async () => {
    await service.markNotifAsRead({
      notifId: 5,
      userId: 10,
    });

    expect(MockNotificationsRepository.markNotifAsRead).toHaveBeenCalledWith(5, 10);
  });

  it("should create recipe change notification and notify websocket client", async () => {
    const notification = {
      id: 1,
      type: "RECIPE_CHANGE",
    };

    MockNotificationsRepository.createNotification.mockResolvedValue(notification);

    await service.recipeChangeNotif(10, "Pizza");

    expect(MockNotificationsRepository.createNotification).toHaveBeenCalledWith(
      "RECIPE_CHANGE",
      {
        recipeTitle: "Pizza",
      },
      10,
    );

    expect(MockNotificationGateway.notifyUser).toHaveBeenCalledWith(
      10,
      notification,
    );
  });
});
