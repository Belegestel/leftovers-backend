import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { UsersRepository } from "../users/users.repository";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  private readonly bcryptHashingRounds: number; 

  constructor(
    private readonly usersRepository: UsersRepository,
    private config: ConfigService,
  ) {
    this.bcryptHashingRounds = parseInt(this.config.get("BCRYPT_HASHING_ROUNDS") ?? "12", 10);
  }

  async signup(dto: SignupDto) {
    const email = dto.email.toLowerCase();
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    const salt = this.bcryptHashingRounds;
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const user = await this.usersRepository.create({
      email,
      name: dto.name,
      password: hashedPassword
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
