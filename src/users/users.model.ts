import { User as PrismaUser } from "../generated/prisma/client";

export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}

export class UserMapper {
  static toDto(user: PrismaUser) {
    return new User(user.id, user.name, user.email, user.password);
  }
}
