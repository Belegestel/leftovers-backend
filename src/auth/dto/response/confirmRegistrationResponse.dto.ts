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

  private constructor(id: number, email: string) {
    this.id = id;
    this.email = email;
  }

  static from(
    confirmRegistrationResult: ConfirmRegistrationResult,
  ): ConfirmRegistrationResponse {
    return new ConfirmRegistrationResponse(
      confirmRegistrationResult.id,
      confirmRegistrationResult.email,
    );
  }
}
