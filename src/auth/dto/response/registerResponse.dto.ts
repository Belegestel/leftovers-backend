import { ApiProperty } from "@nestjs/swagger";
import { RegisterResultDto } from "./registerResult.dto";

export class RegisterResponseDto {
  @ApiProperty({
    description: "Message to user",
    example: "Confirmation email sent.",
  })
  message: string;

  static from(registerResult: RegisterResultDto): RegisterResponseDto {
    return { message: registerResult.message };
  }
}
