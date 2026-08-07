import { ApiProperty } from "@nestjs/swagger";
import { Notification } from "../generated/prisma/client";

export class NotificationModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isRead: boolean;

  private constructor(
    id: number,
    title: string,
    description: string,
    isRead: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isRead = isRead;
  }

  static fromPrisma(prismaNotif: Notification): NotificationModel {
    return new NotificationModel(
      prismaNotif.id,
      prismaNotif.title,
      prismaNotif.description,
      prismaNotif.isRead,
    );
  }
}
