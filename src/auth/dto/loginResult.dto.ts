import { ApiProperty } from "@nestjs/swagger";

export class LoginResult {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  private constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
  static from(accessToken: string, refreshToken: string): LoginResult {
    return new LoginResult(accessToken, refreshToken);
  }
}
