import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RegisterRequest } from "./request";

export class SignupUser {
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

  private constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  static from(signupRequest: RegisterRequest): SignupUser {
    return new SignupUser(
      signupRequest.email,
      signupRequest.password,
    );
  }
}
