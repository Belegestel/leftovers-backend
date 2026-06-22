import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { PrismaService } from "../prisma/prisma.service";
import { mockPrismaService } from "../../test/unit/mocks/mockPrismaService";
import { mockAuthService } from "../../test/unit/mocks/mockAuthService";

describe("AuthController", () => {
  let controller: AuthController;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user", async () => {
    const dto: SignupDto = {
      email: "john.doe@email.com",
      password: "password",
      name: "John Doe",
    };
    const expectedResult = {
      id: 1,
      email: dto.email,
    };

    mockAuthService.signup.mockResolvedValue(expectedResult);
    const result = await controller.signup(dto);
    expect(result).toEqual(expectedResult);
    expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
  });

  it("should login the user and return JWT", async () => {
    const dto = {
      email: "john.doe@email.com",
      password: "password",
    };
    const expectedResult = "jwt-token";

    mockAuthService.login.mockResolvedValue(expectedResult);

    const result = await controller.login(dto);
    expect(result).toEqual(expectedResult);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });
});
