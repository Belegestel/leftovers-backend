import { ApiProperty } from "@nestjs/swagger";

export class ConfirmPasswordResetResponse {
  @ApiProperty()
  message: string;

  private constructor(message: string) {
    this.message = message;
  }

  static new() {
    return new ConfirmPasswordResetResponse("Password reset successfully");
  }
}
