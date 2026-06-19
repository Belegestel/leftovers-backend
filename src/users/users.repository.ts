import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User, UserMapper } from '../users/users.model';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const res = await this.prisma.users.findMany();
    return res.map(UserMapper.toDto);
  }

  async findByEmail(email: string): Promise<User | null> {
    const res = await this.prisma.users.findUnique({
      where: { email },
    });
    return res ? UserMapper.toDto(res) : null;
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
  }): Promise<User> {
    const user = await this.prisma.users.create({
      data,
    });
    return UserMapper.toDto(user);
  }
}
