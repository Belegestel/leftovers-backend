import { NotificationModel } from "../notification.model";

export class AllNotifsResult {
  notifications: NotificationModel[];

  private constructor(notifications: NotificationModel[]) {
    this.notifications = notifications;
  }

  static from(notifications: NotificationModel[]): AllNotifsResult {
    return new AllNotifsResult(notifications);
  }
}
