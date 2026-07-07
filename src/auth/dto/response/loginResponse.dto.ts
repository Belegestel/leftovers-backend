import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LoginResult } from "../loginResult.dto";

export class LoginResponse {
  @ApiProperty({
    example: "VGzaxSmzmSKULOLvrHrdFDCjHQywmd",
    description: "JWT access token",
  })
  @IsString()
  accessToken: string;

  static from(loginResult: LoginResult): LoginResponse {
    return { accessToken: loginResult.accessToken };
  }
}
