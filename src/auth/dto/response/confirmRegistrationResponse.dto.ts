import { ApiProperty } from "@nestjs/swagger";
import { ConfirmRegistrationResultDto } from "./confirmRegistrationResult.dto";

export class ConfirmRegistrationResponseDto {
  @ApiProperty({
    description: "User ID",
    example: 5432,
  })
  id: number;

  @ApiProperty({
    description: "User email",
    example: "john.doe@email.com",
  })
  email: string;

  static from(
    confirmRegistrationResult: ConfirmRegistrationResultDto,
  ): ConfirmRegistrationResultDto {
    return {
      id: confirmRegistrationResult.id,
      email: confirmRegistrationResult.email,
    };
  }
}
