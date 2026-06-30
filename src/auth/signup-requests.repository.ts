import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SignupRequestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.signupRequest.findUnique({
      where: { email },
    });
  }

  findByToken(token: string) {
    return this.prisma.signupRequest.findUnique({
      where: { token },
    });
  }

  create(data: {
    email: string;
    name: string;
    password_hash: string;
    token: string;
    expires_at: Date;
  }) {
    return this.prisma.signupRequest.create({ data });
  }

  deleteById(id: number) {
    this.prisma.signupRequest.delete({
      where: { id },
    });
  }
}
