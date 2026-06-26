import { ApiProperty } from "@nestjs/swagger";
import { SignupResultDto } from "./signupResult.dto";

export class SignupResponseDto {
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

  static from(signupResult: SignupResultDto): SignupResponseDto {
    return { id: signupResult.id, email: signupResult.email };
  }
}
