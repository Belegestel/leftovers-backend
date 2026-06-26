import { Body, Post, Controller, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupRequestDto } from "./dto/request/signupRequest.dto";
import {
  ApiOkResponse,
  ApiConflictResponse,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiBody,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { LoginRequestDto } from "./dto/request/loginRequest.dto";
import { LoginResponseDto } from "./dto/response/loginResponse.dto";
import { SignupResponseDto } from "./dto/response/signupResponse.dto";
import { SignupAttemptDto } from "./dto/request/signupAttempt.dto";
import { LoginAttemptDto } from "./dto/request/loginAttempt.dto";
import { RegisterRequestDto } from "./dto/request/registerRequest.dto";
import { RegisterResponseDto } from "./dto/response/registerResponse.dto";
import { ConfirmRegistrationRequestDto } from "./dto/request/confirmRegistrationRequest.dto";
import { ConfirmRegistrationResponseDto } from "./dto/response/confirmRegistrationResponse.dto";

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
    type: SignupRequestDto,
    description: "User registration data",
  })
  @ApiOkResponse({
    description: "User account successfully created.",
    type: SignupResponseDto,
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
  async signup(@Body() dto: SignupRequestDto): Promise<SignupResponseDto> {
    const input: SignupAttemptDto = {
      email: dto.email,
      password: dto.password,
      name: dto.name,
    };
    const result = await this.authService.signup(input);
    return {
      id: result.id,
      email: result.email,
    };
  }

  @ApiOperation({
    summary: "Log in to user account and return JWT, if account exists.",
  })
  @ApiBody({
    type: LoginRequestDto,
    description: "User login data",
  })
  @ApiOkResponse({
    description: "User logged in.",
    type: LoginResponseDto,
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
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    const input: LoginAttemptDto = {
      email: dto.email,
      password: dto.password,
    };
    const result = await this.authService.login(input);
    return {
      accessToken: result.accessToken,
    };
  }

  @ApiOperation({
    summary: "Start the signup process to get an email with confirmation link",
  })
  @ApiBody({
    type: RegisterRequestDto,
    description: "User registration data",
  })
  @ApiOkResponse({
    description: "User logged in",
    type: RegisterResponseDto,
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
    @Body() dto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const input: SignupAttemptDto = {
      email: dto.email,
      password: dto.password,
      name: dto.name,
    };
    const result = await this.authService.register(input);
    const response: RegisterResponseDto = {
      message: result.message,
    };
    return response;
  }

  @ApiOperation({
    summary: "Confirm registration using email and token",
  })
  @ApiBody({
    type: ConfirmRegistrationRequestDto,
    description: "Email and verification token received via email",
  })
  @ApiOkResponse({
    description: "User account sucessfuly created",
    type: ConfirmRegistrationResponseDto,
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
    @Body() dto: ConfirmRegistrationRequestDto,
  ): Promise<ConfirmRegistrationResponseDto> {
    const result = await this.authService.confirmRegistration({
      email: dto.email,
      token: dto.token,
    });
    return {
      id: result.id,
      email: result.email,
    };
  }
}
