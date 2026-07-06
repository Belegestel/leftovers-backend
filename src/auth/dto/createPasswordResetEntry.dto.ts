export class CreatePasswordResetEntry {
  email: string;
  tokenHash: string;
  expiresAt: Date;

  static from(email: string, tokenHash: string, expiresAt: Date) {
    return {
      email,
      tokenHash,
      expiresAt,
    };
  }
}
