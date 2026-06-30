import { ApiProperty } from "@nestjs/swagger";
import { SignupResult } from "./signupResult.dto";

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

  static from(signupResult: SignupResult): SignupResponse {
    return { id: signupResult.id, email: signupResult.email };
  }
}
