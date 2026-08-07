import { PrismaService } from "../prisma/prisma.service";
import {
  NotificationVariant,
  NotifVariantToPrisma,
} from "./notification-variant.enum";
import { NotificationModel } from "./notification.model";
import { Injectable } from "@nestjs/common";
import type { InputJsonValue } from "@prisma/client/runtime/client";

export type NotificationData = {
  recipeTitle: string;
};

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllNotifs(userId: number): Promise<NotificationModel[]> {
    const notifs = await this.prisma.notification.findMany({
      where: { userId },
    });
    return notifs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((notif) => NotificationModel.fromPrisma(notif));
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

  async createNotification(
    variant: NotificationVariant,
    data: NotificationData,
    userId: number,
  ): Promise<NotificationModel> {
    const notif = await this.prisma.notification.create({
      data: {
        type: NotifVariantToPrisma(variant),
        data: data as InputJsonValue,
        userId,
      },
    });
    return NotificationModel.fromPrisma(notif);
  }
}
