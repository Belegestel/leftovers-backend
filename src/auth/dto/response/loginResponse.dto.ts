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

  @ApiProperty({
    example: "VGzaxSmzmSKULOLvrHrdFDCjHQywmd",
    description: "Refresh token",
  })
  @IsString()
  refreshToken: string;

  private constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  static from(loginResult: LoginResult): LoginResponse {
    return new LoginResponse(loginResult.accessToken, loginResult.refreshToken);
  }
}
