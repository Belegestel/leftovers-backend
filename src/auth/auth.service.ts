import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { UsersRepository } from "../users/users.repository";
import { SignupRequestsRepository } from "./signup-requests.repository";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "../email/email.service";
import { createHash, randomBytes } from "crypto";
import { ConfirmRegistration } from "./dto/confirmRegistration.dto";
import { LoginUser } from "./dto/loginUser.dto";
import { LoginResult } from "./dto/loginResult.dto";
import { SignupUser } from "./dto/signupUser.dto";
import { SignupResult } from "./dto/signupResult.dto";
import { RegisterUser } from "./dto/registerUser.dto";
import { RegisterResult } from "./dto/registerResult.dto";
import { ConfirmRegistrationResult } from "./dto/confirmRegistrationResult.dto";
import { CreateSignupRequest } from "./dto/createSignupRequest.dto";
import { PasswordResetRepository } from "./password-reset.repository";
import { CreatePasswordReset } from "./dto/createPasswordReset.dto";
import { CreatePasswordResetEntry } from "./dto/createPasswordResetEntry.dto";
import { ConfirmPasswordReset } from "./dto/confirmPasswordReset.dto";
import { FindPasswordResetToken } from "./dto/findPasswordResetToken.dto";
import { HOUR_IN_MS } from "../common/utils";

@Injectable()
export class AuthService {
  private readonly bcryptHashingRounds: number;
  private readonly frontendUrl: string;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly signupRequestsRepository: SignupRequestsRepository,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly passwordResetRepository: PasswordResetRepository,
  ) {
    this.bcryptHashingRounds = parseInt(
      this.config.get("BCRYPT_HASHING_ROUNDS") ?? "12",
      10,
    );
    this.frontendUrl =
      this.config.get<string>("FRONTEND_URL") || "http://localhost:3000";
  }

  async signup(dto: SignupUser): Promise<SignupResult> {
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

    return SignupResult.from(user.id, user.email);
  }

  async login(dto: LoginUser): Promise<LoginResult> {
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

    return LoginResult.from(accessToken);
  }

  async register(dto: RegisterUser): Promise<RegisterResult> {
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
    const expiresAt = new Date(Date.now() + 24 * HOUR_IN_MS);

    const input = CreateSignupRequest.from(
      email,
      dto.name,
      hashedPassword,
      token,
      expiresAt,
    );

    await this.signupRequestsRepository.create(input);

    const confirmationLink =
      `${this.frontendUrl}/confirm-registration` +
      `?email=${encodeURIComponent(email)}` +
      `&token=${encodeURIComponent(token)}`;

    const frontendUrl = this.frontendUrl;

    await this.emailService.sendEmail(
      email,
      "Confirm your registration",
      "registration-confirmation",
      { confirmationLink, frontendUrl},
    );
    return RegisterResult.from("Confirmation email sent.");
  }

  async confirmRegistration(
    dto: ConfirmRegistration,
  ): Promise<ConfirmRegistrationResult> {
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
      password: req.password_hash,
    });

    this.signupRequestsRepository.deleteById(req.id);

    return new ConfirmRegistrationResult(user.id, user.email);
  }

  async initiatePasswordReset(dto: CreatePasswordReset): Promise<void> {
    const user = await this.usersRepository.findByEmail(dto.email);

    if (!user) {
      return;
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * HOUR_IN_MS);

    await this.passwordResetRepository.create(
      CreatePasswordResetEntry.from(dto.email, tokenHash, expiresAt),
    );

    const link =
      `${this.frontendUrl}/reset-password?email=${encodeURIComponent(dto.email)}` +
      `&token=${encodeURIComponent(token)}`;

    await this.emailService.sendEmail(
      dto.email,
      "Reset your password",
      "password-reset",
      { resetLink: link },
    );
  }

  async confirmPasswordReset(dto: ConfirmPasswordReset): Promise<void> {
    const tokenHash = createHash("sha256").update(dto.token).digest("hex");
    const req = await this.passwordResetRepository.findValidByTokenHash(
      FindPasswordResetToken.from(tokenHash),
    );

    if (
      !req ||
      (req.usedAt && req.usedAt.getTime() < Date.now()) ||
      req.expiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException("Invalid data or expired token");
    }

    const user = await this.usersRepository.findByEmail(req.email);

    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      this.bcryptHashingRounds,
    );

    if (!user) {
      throw new InternalServerErrorException("Database error");
    }
    await this.passwordResetRepository.resetPassword(
      this.usersRepository,
      req.id,
      user.id,
      hashedPassword,
    );
  }
}
