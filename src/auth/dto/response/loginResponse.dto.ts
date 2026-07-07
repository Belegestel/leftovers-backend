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

  private constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  static from(loginResult: LoginResult): LoginResponse {
    return new LoginResponse(loginResult.accessToken);
  }
}
