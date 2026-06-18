import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersRepository } from "../users/users.repository";
import { SignupDto } from "./dto/signup.dto";
import { ConflictException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock("../prisma/prisma.service", () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => mockPrismaService),
  };
});

describe("AuthService", () => {
  let service: AuthService;

  const mockUsersRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should create a new user", async () => {
      const dto: SignupDto = {
        email: "john.doe@email.com",
        password: "password",
        name: "John Doe",
      };

      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockConfigService.get.mockReturnValue("12");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      mockUsersRepository.create.mockResolvedValue({
        id: 1,
        email: dto.email,
        name: dto.name,
        password: "hashed-password",
      });

      const result = await service.signup(dto);
      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
        "john.doe@email.com",
      );
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 12);
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        email: "john.doe@email.com",
        password: "hashed-password",
        name: "John Doe",
      });
      expect(result).toEqual({
        id: 1,
        email: "john.doe@email.com",
      });
    });

    it("should throw ConflictException if email already exists", async () => {
      const dto: SignupDto = {
        email: "john.doe@email.com",
        password: "password",
        name: "John Doe",
      };

      mockUsersRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: dto.email,
      });

      await expect(service.signup(dto)).rejects.toThrow(ConflictException);
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });
  });
});
