import { ApiProperty } from "@nestjs/swagger";
import { NotificationModel } from "../../notification.model";
import { AllNotifsResult } from "../allNotifsResult.dto";

export class AllNotificationsResponse {
  @ApiProperty()
  notifications: NotificationModel[];

  private constructor(notifications: NotificationModel[]) {
    this.notifications = notifications;
  }

  static from(dto: AllNotifsResult): AllNotificationsResponse {
    return new AllNotificationsResponse(dto.notifications);
  }
}
