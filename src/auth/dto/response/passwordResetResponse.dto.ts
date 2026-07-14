import { ApiProperty } from "@nestjs/swagger";

export class PasswordResetResponse {
  @ApiProperty()
  message: string;

  private constructor(message: string) {
    this.message = message;
  }
  static new(): PasswordResetResponse {
    return new PasswordResetResponse(
      "If email exists, the message has been sent.",
    );
  }
}
