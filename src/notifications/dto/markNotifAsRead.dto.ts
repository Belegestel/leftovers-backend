export class MarkNotifAsRead {
  notifId: number;
  userId: number;

  private constructor(notifId: number, userId: number) {
    this.notifId = notifId;
    this.userId = userId;
  }

  static from(notifId: number, userId: number) {
    return new MarkNotifAsRead(notifId, userId);
  }
}
