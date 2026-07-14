import { ApiProperty } from "@nestjs/swagger";
import { SignupResult } from "../signupResult.dto";

export class SignupResponse {
  @ApiProperty({
    description: "User ID",
    example: 127,
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

  static from(signupResult: SignupResult): SignupResponse {
    return new SignupResponse(signupResult.id, signupResult.email);
  }
}
