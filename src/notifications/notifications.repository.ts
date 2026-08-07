import { PrismaService } from "../prisma/prisma.service";
import { NotificationModel } from "./notification.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllNotifs(userId: number): Promise<NotificationModel[]> {
    const notifs = await this.prisma.notification.findMany({
      where: { userId },
    });
    return notifs.map((notif) => NotificationModel.fromPrisma(notif));
  }

  async markNotifAsRead(notifId: number, userId: number): Promise<void> {
    await this.prisma.notification.update({
      where: {
        userId,
        id: notifId,
      },
      data: {
        isRead: true,
      },
    });
  }
}
