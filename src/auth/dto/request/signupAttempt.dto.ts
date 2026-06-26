import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SignupRequestDto } from "./signupRequest.dto";

export class SignupAttemptDto {
  @ApiProperty({
    example: "john.doe@email.com",
    description: "User email.",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "MySecretPassword123!",
    description: "User password of length 8 or more.",
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: "John Doe",
    description: "User name.",
  })
  @IsString()
  name: string;

  static from(signupRequest: SignupRequestDto): SignupAttemptDto {
    return {
      email: signupRequest.email,
      password: signupRequest.password,
      name: signupRequest.name,
    };
  }
}
