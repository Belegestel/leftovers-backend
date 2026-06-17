import { Injectable, ConflictException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { SignupDto } from "./dto/signup.dto";
import { ConfigService } from "@nestjs/config";
import { UsersRepository } from "../users/users.repository";

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const email = dto.email.toLowerCase();
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    const salt = parseInt(this.config.get("BCRYPT_HASHING_ROUNDS") ?? "12", 10);
    const hashed_password = await bcrypt.hash(dto.password, salt);
    const user = await this.usersRepository.create({
      email,
      name: dto.name,
      password: hashed_password
    });

    return {
      id: user.id,
      email: user.email,
    };
  }
}
