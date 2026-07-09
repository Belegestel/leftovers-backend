import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User, UserMapper } from "../users/users.model";
import { PrismaTransaction } from "../prisma/prisma.types";

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const res = await this.prisma.user.findMany();
    return res.map(UserMapper.toDto);
  }

  async findByEmail(email: string): Promise<User | null> {
    const res = await this.prisma.user.findUnique({
      where: { email },
    });
    return res ? UserMapper.toDto(res) : null;
  }

  async create(data: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });
    return UserMapper.toDto(user);
  }

  async updatePassword(
    id: number,
    passwordHash: string,
    tx?: PrismaTransaction,
  ): Promise<void> {
    const db = tx ?? this.prisma;

    await db.user.update({
      where: { id },
      data: { password: passwordHash },
    });
  }
}
