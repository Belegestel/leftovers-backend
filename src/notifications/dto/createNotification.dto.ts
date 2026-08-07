export class CreateNotification {
  title: string;
  description: string;

  private constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }

  static from(title: string, description: string): CreateNotification {
    return new CreateNotification(title, description);
  }
}
