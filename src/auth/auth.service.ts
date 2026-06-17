import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { SignupDto } from "./dto/signup.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const email = dto.email.toLowerCase();
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    const hashed_password = await bcrypt.hash(
      dto.password,
      this.config.get<number>("BCRYPT_HASHING_ROUNDS") ?? 12,
    );
    const user = await this.prisma.users.create({
      data: {
        email,
        name: dto.name,
        password: hashed_password,
      },
    });

    return {
      id: user.id,
      email: user.email,
    };
  }
}
