import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LoginRequest } from "./request/loginRequest.dto";

export class LoginUser {
  @ApiProperty({
    description: "User email",
    example: "john.doe@email.com",
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: "User password",
    example: "password123",
  })
  @IsString()
  password: string;

  static from(loginRequest: LoginRequest): LoginUser {
    return {
      email: loginRequest.email,
      password: loginRequest.password,
    };
  }
}
