import { Injectable } from "@nestjs/common";
import { AllNotifsResult } from "./dto/allNotifsResult.dto";
import { GetAllNotifs } from "./dto/getAllNotifs.dto";
import { NotificationsRepository } from "./notifications.repository";
import { MarkNotifAsRead } from "./dto/markNotifAsRead.dto";
import { NotificationsGateway } from "./notifications.gateway";
import { NotificationVariant } from "./notification-variant.enum";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notifRepository: NotificationsRepository,
    private readonly notifGateway: NotificationsGateway,
  ) {}

  async getAllNotifs(dto: GetAllNotifs): Promise<AllNotifsResult> {
    const notifs = await this.notifRepository.getAllNotifs(dto.userId);
    return AllNotifsResult.from(notifs);
  }

  async markNotifAsRead(dto: MarkNotifAsRead): Promise<void> {
    await this.notifRepository.markNotifAsRead(dto.notifId, dto.userId);
  }

  async recipeChangeNotif(userId: number, recipeTitle: string): Promise<void> {
    const notification = await this.notifRepository.createNotification(
      NotificationVariant.RECIPE_EDIT,
      { recipeTitle },
      userId,
    );

    this.notifGateway.notifyUser(userId, notification);
  }
}
