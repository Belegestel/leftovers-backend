import { User } from "../../users/users.model";
import { RefreshToken as PrismaToken } from "../../generated/prisma/client";

export class RefreshToken {
  id: number;
  tokenHash: string;
  userId: number;
  expiresAt: Date;
  user: User;

  private constructor(
    id: number,
    tokenHash: string,
    userId: number,
    expiresAt: Date,
    user: User,
  ) {
    this.id = id;
    this.tokenHash = tokenHash;
    this.userId = userId;
    this.expiresAt = expiresAt;
    this.user = user;
  }

  static from(data: PrismaToken & { user: User }): RefreshToken {
    return new RefreshToken(
      data.id,
      data.tokenHash,
      data.userId,
      data.expiresAt,
      data.user,
    );
  }
}
