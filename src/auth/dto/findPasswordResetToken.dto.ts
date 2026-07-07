export class FindPasswordResetToken {
  tokenHash: string;
  static from(tokenHash: string): FindPasswordResetToken {
    return {
      tokenHash
    }
  }
}
