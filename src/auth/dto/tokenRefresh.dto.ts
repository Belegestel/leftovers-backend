import { TokenRefreshRequest } from "./request/tokenRefreshRequest.dto";

export class TokenRefresh {
  token: string;

  private constructor(token: string) {
    this.token = token;
  }

  static from(dto: TokenRefreshRequest): TokenRefresh {
    return new TokenRefresh(dto.token)
  }
}
