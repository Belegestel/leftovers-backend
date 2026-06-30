import { Body, Post, Controller, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupRequest } from "./dto/request/signupRequest.dto";
import {
  ApiOkResponse,
  ApiConflictResponse,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiBody,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { LoginRequest } from "./dto/request/loginRequest.dto";
import { LoginResponse } from "./dto/response/loginResponse.dto";
import { SignupResponse } from "./dto/response/signupResponse.dto";
import { SignupUser } from "./dto/signupUser.dto";
import { LoginUser } from "./dto/loginUser.dto";
import { RegisterRequest } from "./dto/request/registerRequest.dto";
import { RegisterResponse } from "./dto/response/registerResponse.dto";
import { ConfirmRegistrationRequest } from "./dto/request/confirmRegistrationRequest.dto";
import { ConfirmRegistrationResponse } from "./dto/response/confirmRegistrationResponse.dto";
import { ConfirmRegistration } from "./dto/confirmRegistration.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "[DEPRECATED] Create a new user account, if not exists.",
    description: "Deprecated. Use POST /auth/register instead",
    deprecated: true,
  })
  @ApiBody({
    type: SignupRequest,
    description: "User registration data",
  })
  @ApiOkResponse({
    description: "User account successfully created.",
    type: SignupResponse,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data - validation error",
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ["password must be longer than or equal to 8 characters"],
        error: "Bad request",
      },
    },
  })
  @ApiConflictResponse({
    description: "User email already exists or the input is invalid",
    schema: {
      example: {
        statusCode: HttpStatus.CONFLICT,
        message: "Email already registered",
        error: "Conflict",
      },
    },
  })
  @Post("signup")
  async signup(@Body() dto: SignupRequest): Promise<SignupResponse> {
    const input = SignupUser.from(dto);
    const result = await this.authService.signup(input);
    return SignupResponse.from(result);
  }

  @ApiOperation({
    summary: "Log in to user account and return JWT, if account exists.",
  })
  @ApiBody({
    type: LoginRequest,
    description: "User login data",
  })
  @ApiOkResponse({
    description: "User logged in.",
    type: LoginResponse,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data - validation error",
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ["email must be an email"],
        error: "Bad request",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "User provided invalid credentials",
    schema: {
      example: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ["Invalid credentials"],
        error: "Unauthorized",
      },
    },
  })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequest): Promise<LoginResponse> {
    const input = LoginUser.from(dto);
    const result = await this.authService.login(input);
    return LoginResponse.from(result);
  }

  @ApiOperation({
    summary: "Start the signup process to get an email with confirmation link",
  })
  @ApiBody({
    type: RegisterRequest,
    description: "User registration data",
  })
  @ApiOkResponse({
    description: "User logged in",
    type: RegisterResponse,
  })
  @ApiConflictResponse({
    description: "User already exists or has a not confirmed signup request",
    schema: {
      example: {
        message: "Email already registered",
        error: "Conflict",
        statusCode: HttpStatus.CONFLICT,
      },
    },
  })
  @Post("register")
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() dto: RegisterRequest,
  ): Promise<RegisterResponse> {
    const input = SignupUser.from(dto);
    const result = await this.authService.register(input);
    return RegisterResponse.from(result);
  }

  @ApiOperation({
    summary: "Confirm registration using email and token",
  })
  @ApiBody({
    type: ConfirmRegistrationRequest,
    description: "Email and verification token received via email",
  })
  @ApiOkResponse({
    description: "User account sucessfuly created",
    type: ConfirmRegistrationResponse,
  })
  @ApiBadRequestResponse({
    description: "Invalid or expired token, or no valid email in the request",
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Invalid or expired token",
        error: "Bad Request",
      },
    },
  })
  @Post("confirm-registration")
  async confirmRegistration(
    @Body() dto: ConfirmRegistrationRequest,
  ): Promise<ConfirmRegistrationResponse> {
    const input = ConfirmRegistration.from(dto);
    const result = await this.authService.confirmRegistration(input);
    return ConfirmRegistrationResponse.from(result);
  }
}
