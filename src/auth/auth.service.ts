import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { UsersRepository } from "../users/users.repository";
import { SignupRequestsRepository } from "./signup-requests.repository";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "../email/email.service";
import { randomBytes } from "crypto";
import { ConfirmRegistrationAttemptDto } from "./dto/request/confirmRegistrationAttempt.dto";
import { LoginAttemptDto } from "./dto/request/loginAttempt.dto";
import { LoginResultDto } from "./dto/response/loginResult.dto";
import { SignupAttemptDto } from "./dto/request/signupAttempt.dto";
import { SignupResultDto } from "./dto/response/signupResult.dto";
import { RegisterAttemptDto } from "./dto/request/registerAttempt.dto";
import { RegisterResultDto } from "./dto/response/registerResult.dto";
import { ConfirmRegistrationResultDto } from "./dto/response/confirmRegistrationResult.dto";

@Injectable()
export class AuthService {
  private readonly bcryptHashingRounds: number;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly signupRequestsRepository: SignupRequestsRepository,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.bcryptHashingRounds = parseInt(
      this.config.get("BCRYPT_HASHING_ROUNDS") ?? "12",
      10,
    );
  }

  async signup(dto: SignupAttemptDto): Promise<SignupResultDto> {
    const email = dto.email;
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    const salt = this.bcryptHashingRounds;
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const user = await this.usersRepository.create({
      email,
      name: dto.name,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  async login(dto: LoginAttemptDto): Promise<LoginResultDto> {
    const email = dto.email;
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

  async register(dto: RegisterAttemptDto): Promise<RegisterResultDto> {
    const email = dto.email;
    const existingUser = await this.usersRepository.findByEmail(email);
    const existingSignupRequest =
      await this.signupRequestsRepository.findByEmail(email);

    if (existingUser || existingSignupRequest) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      this.bcryptHashingRounds,
    );

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.signupRequestsRepository.create({
      email,
      name: dto.name,
      password_hash: hashedPassword,
      token,
      expires_at: expiresAt,
    });

    const frontendUrl =
      this.config.get<string>("FRONTEND_URL") || "http://localhost:3000";

    const confirmationLink =
      `${frontendUrl}/confirm-registration` +
      `?email=${encodeURIComponent(email)}` +
      `&token=${encodeURIComponent(token)}`;

    await this.emailService.sendEmail(
      email,
      "Confirm your registration",
      "registration-confirmation",
      { name: dto.name, confirmationLink },
    );
    return { message: "Confirmation email sent." };
  }

  async confirmRegistration(
    dto: ConfirmRegistrationAttemptDto,
  ): Promise<ConfirmRegistrationResultDto> {
    const email = dto.email;
    const req = await this.signupRequestsRepository.findByEmail(email);

    if (!req) {
      throw new BadRequestException("Invalid or expired token");
    }
    if (req.token !== dto.token) {
      throw new BadRequestException("Invalid token");
    }
    if (req.expires_at < new Date()) {
      throw new BadRequestException("Token expired");
    }

    const user = await this.usersRepository.create({
      email: req.email,
      name: req.name,
      password: req.password_hash,
    });

    this.signupRequestsRepository.deleteById(req.id);

    return { id: user.id, email: user.email };
  }
}
