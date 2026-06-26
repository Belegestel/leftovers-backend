import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SignupRequestCreateAttemptDto } from "./dto/request/signupRequestCreateAttempt.dto";

@Injectable()
export class SignupRequestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.signup_requests.findUnique({
      where: { email },
    });
  }

  findByToken(token: string) {
    return this.prisma.signup_requests.findUnique({
      where: { token },
    });
  }

  create(data: SignupRequestCreateAttemptDto) {
    return this.prisma.signup_requests.create({ data });
  }

  deleteById(id: number) {
    this.prisma.signup_requests.delete({
      where: { id },
    });
  }
}
