export class GetAllNotifs {
  userId: number;

  private constructor(userId: number) {
    this.userId = userId;
  }

  static from(userId: number): GetAllNotifs {
    return new GetAllNotifs(userId);
  }
}
