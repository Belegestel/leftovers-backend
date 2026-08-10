import { ApiProperty } from "@nestjs/swagger";
import { Notification } from "../generated/prisma/client";
import {
  NotificationVariant,
  NotifVariantFromPrisma,
} from "./notification-variant.enum";

export class NotificationModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  variant: NotificationVariant;

  @ApiProperty()
  data: Record<string, unknown>;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  createdAt: Date;

  private constructor(
    id: number,
    variant: NotificationVariant,
    data: Record<string, unknown>,
    isRead: boolean,
    createdAt: Date,
  ) {
    this.id = id;
    this.variant = variant;
    this.data = data;
    this.isRead = isRead;
    this.createdAt = createdAt;
  }

  static fromPrisma(prismaNotif: Notification): NotificationModel {
    return new NotificationModel(
      prismaNotif.id,
      NotifVariantFromPrisma(prismaNotif.type),
      prismaNotif.data as Record<string, unknown>,
      prismaNotif.isRead,
      prismaNotif.createdAt,
    );
  }
}
