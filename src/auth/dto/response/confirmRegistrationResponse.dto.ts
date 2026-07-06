import { ApiProperty } from "@nestjs/swagger";
import { ConfirmRegistrationResult } from "../confirmRegistrationResult.dto";

export class ConfirmRegistrationResponse {
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
    confirmRegistrationResult: ConfirmRegistrationResult,
  ): ConfirmRegistrationResult {
    return {
      id: confirmRegistrationResult.id,
      email: confirmRegistrationResult.email,
    };
  }
}
