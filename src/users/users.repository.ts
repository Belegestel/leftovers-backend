import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { users } from "../generated/prisma/client";

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
  }): Promise<users> {
    return this.prisma.users.create({
      data,
    });
  }
}
