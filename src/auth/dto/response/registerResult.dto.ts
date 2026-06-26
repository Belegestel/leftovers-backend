import { ApiProperty } from "@nestjs/swagger";

export class RegisterResultDto {
  @ApiProperty({
    description: "Message to user",
    example: "Confirmation email sent.",
  })
  message: string;
}
