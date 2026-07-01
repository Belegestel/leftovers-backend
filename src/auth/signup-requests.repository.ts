import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSignupRequest } from "./dto/createSignupRequest.dto";

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

  create(data: CreateSignupRequest) {
    return this.prisma.signupRequest.create({
      data: {
        email: data.email,
        name: data.name,
        password_hash: data.passwordHash,
        token: data.token,
        expires_at: data.expiresAt,
      },
    });
  }

  deleteById(id: number) {
    this.prisma.signupRequest.delete({
      where: { id },
    });
  }
}
