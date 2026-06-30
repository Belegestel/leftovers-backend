import { ApiProperty } from "@nestjs/swagger";

export class RegisterResult {
  @ApiProperty({
    description: "Message to user",
    example: "Confirmation email sent.",
  })
  message: string;
}
