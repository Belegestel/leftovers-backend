import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SignupRequest } from "./request/signupRequest.dto";

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

  @ApiProperty({
    example: "John Doe",
    description: "User name.",
  })
  @IsString()
  name: string;

  private constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  static from(signupRequest: SignupRequest): SignupUser {
    return new SignupUser(
      signupRequest.email,
      signupRequest.password,
      signupRequest.name,
    );
  }
}
