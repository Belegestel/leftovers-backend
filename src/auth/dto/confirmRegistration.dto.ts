import { ApiProperty } from "@nestjs/swagger";
import { ConfirmRegistrationRequest } from "./request/confirmRegistrationRequest.dto";

export class ConfirmRegistration {
  @ApiProperty({
    example: "john.doe@email.com",
  })
  email: string;

  @ApiProperty({
    example: "l1kj2h3235",
  })
  token: string;

  static from(
    confirmRegistrationRequest: ConfirmRegistrationRequest,
  ): ConfirmRegistration {
    return {
      email: confirmRegistrationRequest.email,
      token: confirmRegistrationRequest.token,
    };
  }
}
