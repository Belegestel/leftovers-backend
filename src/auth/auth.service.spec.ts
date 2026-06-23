import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersRepository } from "../users/users.repository";
import { SignupDto } from "./dto/signup.dto";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { mockPrismaService } from "../../test/unit/mocks/mockPrismaService";
import { mockUsersRepository } from "../../test/unit/mocks/mockUsersRepository";
import { PrismaService } from "../prisma/prisma.service";
import { SignupRequestsRepository } from "./signup-requests.repository";
import { mockSignupRequestsRepository } from "../../test/unit/mocks/mockSignupRequestsRepository";
import { mockEmailService } from "../../test/unit/mocks/mockEmailService";
import { EmailService } from "../email/email.service";
import { warn } from "console";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("AuthService", () => {
  let service: AuthService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: SignupRequestsRepository,
          useValue: mockSignupRequestsRepository,
        },
        { provide: EmailService, useValue: mockEmailService },
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: "test.env",
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should create a signup request and send email", async () => {
      const dto: SignupDto = {
        email: "john.doe@email.com",
        name: "John Doe",
        password: "password123",
      };

      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockSignupRequestsRepository.findByEmail.mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      mockSignupRequestsRepository.create.mockResolvedValue({
        id: 1,
        email: dto.email,
      });

      const res = await service.register(dto);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(mockSignupRequestsRepository.findByEmail).toHaveBeenCalledWith(
        dto.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
      expect(mockSignupRequestsRepository.create).toHaveBeenCalled();
      expect(res).toEqual({
        message: "Confirmation email sent.",
      });
    });

    it("should throw ConflictException if email already exists", async () => {
      const dto: SignupDto = {
        email: "john.doe@email.com",
        name: "John Doe",
        password: "password123",
      };

      mockUsersRepository.findByEmail.mockResolvedValue({ id: 1 });
      mockSignupRequestsRepository.findByEmail.mockResolvedValue(null);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      expect(mockSignupRequestsRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("confirmRegistration", () => {
    it("should create user and delete signup requests", async () => {
      const dto = {
        email: "john.doe@email.com",
        token: "valid-token",
      };
      mockSignupRequestsRepository.findByEmail.mockResolvedValue({
        email: dto.email,
        token: dto.token,
        expires_at: new Date(Date.now() + 10000),
        name: "John Doe",
        password_hash: "hashed-password",
        id: 1,
      });
      mockUsersRepository.create.mockResolvedValue({ id: 1, email: dto.email });

      const result = await service.confirmRegistration(dto);
      expect(mockSignupRequestsRepository.deleteById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, email: dto.email });
    });

    it("should throw error for invalid token", async () => {
      const dto = { email: "john.doe@email.com", token: "wrong-token" };
      mockSignupRequestsRepository.findByEmail.mockResolvedValue({
        email: dto.email,
        token: "valid-token",
        expires_at: new Date(Date.now() + 10000),
        name: "John Doe",
        password_hash: "hashed-password",
      });

      await expect(service.confirmRegistration(dto)).rejects.toThrow();
    });

    it("should throw error for expired token", async () => {
      const dto = { email: "john.doe@email.com", token: "valid-token" };
      mockSignupRequestsRepository.findByEmail.mockResolvedValue({
        email: dto.email,
        token: dto.token,
        expires_at: new Date(Date.now() - 10000),
        name: "John Doe",
        password_hash: "hashed-password",
      });
      await expect(service.confirmRegistration(dto)).rejects.toThrow();
    });
  });

  describe("login", () => {
    it("should return a JWT for valid credentials", async () => {
      const dto = {
        email: "john.doe@email.com",
        password: "password",
      };

      mockUsersRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: dto.email,
        password: "hashed-password",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue("jwt-token");

      const result = await service.login(dto);

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password",
        "hashed-password",
      );
      expect(mockJwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: "jwt-token",
      });
    });

    it("should throw UnauthorizedException if user does not exist", async () => {
      const dto = {
        email: "missing@email.com",
        password: "password",
      };
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if the password is incorrect", async () => {
      const dto = {
        email: "john.doe@email.com",
        password: "incorrect",
      };
      mockUsersRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: dto.email,
        password: "hashed-password",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
