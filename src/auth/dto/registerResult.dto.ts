import { ApiProperty } from "@nestjs/swagger";

export class RegisterResult {
  @ApiProperty({
    description: "Message to user",
    example: "Confirmation email sent.",
  })
  message: string;

  private constructor(message: string) {
    this.message = message;
  }
  static from(message: string): RegisterResult {
    return new RegisterResult(message);
  }
}
