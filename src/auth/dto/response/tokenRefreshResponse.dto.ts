import { ApiProperty } from "@nestjs/swagger";
import { RefreshResult } from "../refreshResult.dto";

export class TokenRefreshResponse {
  @ApiProperty({ description: "User's access token" })
  accessToken: string;

  @ApiProperty({ description: "User's refresh token" })
  refreshToken: string;

  private constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  static from(dto: RefreshResult): TokenRefreshResponse {
    return new TokenRefreshResponse(dto.accessToken, dto.refreshToken);
  }
}
