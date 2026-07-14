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

  private constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  static from(loginRequest: LoginRequest): LoginUser {
    return new LoginUser(loginRequest.email, loginRequest.password);
  }
}
