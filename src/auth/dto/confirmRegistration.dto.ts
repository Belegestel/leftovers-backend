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

  private constructor(email: string, token: string) {
    this.email = email;
    this.token = token;
  }

  static from(
    confirmRegistrationRequest: ConfirmRegistrationRequest,
  ): ConfirmRegistration {
    return new ConfirmRegistration(
      confirmRegistrationRequest.email,
      confirmRegistrationRequest.token,
    );
  }
}
