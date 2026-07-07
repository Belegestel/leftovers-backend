import { ApiProperty } from "@nestjs/swagger";

export class PasswordResetResponse {
  @ApiProperty()
  message: string;
  static new() {
    return { message: "If email exists, the message has been sent." };
  }
}
