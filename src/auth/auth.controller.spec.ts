import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { PrismaService } from "../prisma/prisma.service";
import { mockPrismaService } from "../../test/unit/mocks/mockPrismaService";
import { mockAuthService } from "../../test/unit/mocks/mockAuthService";
import { LoginResultDto } from "./dto/response/loginResult.dto";
import { RegisterResponseDto } from "./dto/response/registerResponse.dto";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("AuthController", () => {
  let controller: AuthController;

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

  it("should initiate registration and call auth service", async () => {
    const dto: SignupDto = {
      email: "john.doe@email.com",
      password: "password123",
      name: "John Doe",
    };

    const expectedResult: RegisterResponseDto = {
      message: "Confirmation email sent.",
    };
    mockAuthService.register.mockResolvedValue(expectedResult);
    const res = await controller.register(dto);
    expect(res).toEqual(expectedResult);
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });

  it("should confirm registration and create user", async () => {
    const dto = {
      email: "john.doe@email.com",
      token: "valid-token",
    };
    const expectedResult = { id: 1, email: dto.email };
    mockAuthService.confirmRegistration.mockResolvedValue(expectedResult);
    const res = await controller.confirmRegistration(dto);

    expect(res).toEqual(expectedResult);
    expect(mockAuthService.confirmRegistration).toHaveBeenCalledWith(dto);
  });

  it("should login the user and return JWT", async () => {
    const dto = {
      email: "john.doe@email.com",
      password: "password",
    };
    const expectedResult: LoginResultDto = { accessToken: "jwt-token" };

    mockAuthService.login.mockResolvedValue(expectedResult);

    const result = await controller.login(dto);
    expect(result).toEqual(expectedResult);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });
});
