import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePasswordResetEntry } from "./dto/createPasswordResetEntry.dto";
import { FindPasswordResetToken } from "./dto/findPasswordResetToken.dto";
import { FindPasswordResetEmail } from "./dto/findPasswordResetEmail.dto";

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
      where: { tokenHash: dto.tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
  }

  async markAsUsed(id: number) {
    return this.prisma.passwordResetRequest.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}
