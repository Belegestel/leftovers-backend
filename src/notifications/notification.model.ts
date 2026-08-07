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

  private constructor(
    id: number,
    variant: NotificationVariant,
    data: Record<string, unknown>,
    isRead: boolean,
  ) {
    this.id = id;
    this.variant = variant;
    this.data = data;
    this.isRead = isRead;
  }

  static fromPrisma(prismaNotif: Notification): NotificationModel {
    return new NotificationModel(
      prismaNotif.id,
      NotifVariantFromPrisma(prismaNotif.type),
      prismaNotif.data as Record<string, unknown>,
      prismaNotif.isRead,
    );
  }
}
