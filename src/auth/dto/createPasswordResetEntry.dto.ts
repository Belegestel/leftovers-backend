export class CreatePasswordResetEntry {
  email: string;
  tokenHash: string;
  expiresAt: Date;

  private constructor(email: string, tokenHash: string, expiresAt: Date) {
    this.email = email;
    this.tokenHash = tokenHash;
    this.expiresAt = expiresAt;
  }

  static from(email: string, tokenHash: string, expiresAt: Date): CreatePasswordResetEntry {
    return new CreatePasswordResetEntry(email, tokenHash, expiresAt);
  }
}
