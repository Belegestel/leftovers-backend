export class FindPasswordResetToken {
  tokenHash: string;

  private constructor(tokenHash: string) {
    this.tokenHash = tokenHash;
  }

  static from(tokenHash: string): FindPasswordResetToken {
    return new FindPasswordResetToken(tokenHash);
  }
}
