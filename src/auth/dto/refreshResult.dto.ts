export class RefreshResult {
  accessToken: string;
  refreshToken: string;
  private constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
  static from(accessToken: string, refreshToken: string): RefreshResult {
    return new RefreshResult(accessToken, refreshToken);
  }
}
