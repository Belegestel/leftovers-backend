import { ApiProperty } from "@nestjs/swagger";
import { RegisterResult } from "../registerResult.dto";

export class RegisterResponse {
  @ApiProperty({
    description: "Message to user",
    example: "Confirmation email sent.",
  })
  message: string;

  private constructor(message: string) {
    this.message = message;
  }

  static from(registerResult: RegisterResult): RegisterResponse {
    return new RegisterResponse(registerResult.message);
  }
}
