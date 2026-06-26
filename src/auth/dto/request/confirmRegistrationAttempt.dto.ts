import { ApiProperty } from "@nestjs/swagger";
import { ConfirmRegistrationRequestDto } from "./confirmRegistrationRequest.dto";

export class ConfirmRegistrationAttemptDto {
  @ApiProperty({
    example: "john.doe@email.com",
  })
  email: string;

  @ApiProperty({
    example: "l1kj2h3235",
  })
  token: string;

  static from(
    confirmRegistrationRequest: ConfirmRegistrationRequestDto,
  ): ConfirmRegistrationAttemptDto {
    return {
      email: confirmRegistrationRequest.email,
      token: confirmRegistrationRequest.token,
    };
  }
}
