import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePasswordResetEntry } from "./dto/createPasswordResetEntry.dto";
import { FindPasswordResetToken } from "./dto/findPasswordResetToken.dto";
import { FindPasswordResetEmail } from "./dto/findPasswordResetEmail.dto";
import { PrismaTransaction } from "../prisma/prisma.types";
import { UsersRepository } from "../users/users.repository";

@Injectable()
export class PasswordResetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePasswordResetEntry) {
    return this.prisma.passwordResetRequest.create({
      data: {
        email: dto.email,
        tokenHash: dto.tokenHash,
        expiresAt: dto.expiresAt,
      },
    });
  }

  async findValidByEmail(dto: FindPasswordResetEmail) {
    return this.prisma.passwordResetRequest.findFirst({
      where: { email: dto.email, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findValidByTokenHash(dto: FindPasswordResetToken) {
    return this.prisma.passwordResetRequest.findFirst({
      where: {
        tokenHash: dto.tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async markAsUsed(id: number, tx?: PrismaTransaction) {
    const db = tx ?? this.prisma;
    return db.passwordResetRequest.updateMany({
      where: { id, usedAt: null },
      data: { usedAt: new Date() },
    });
  }

  async resetPassword(
    usersRepository: UsersRepository,
    resetRequestId: number,
    userId: number,
    passwordHash: string,
  ): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const used = await this.markAsUsed(resetRequestId, tx);
      if (used.count === 0) {
        return false;
      }

      await usersRepository.updatePassword(userId, passwordHash, tx);
      return true;
    });
  }
}
