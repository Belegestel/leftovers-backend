import {
  Body,
  Post,
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
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
import {
  LoginResponse,
  SignupResponse,
  RegisterResponse,
  ConfirmRegistrationResponse,
} from "./dto/response";
import {
  SignupUser,
  LoginUser,
  ConfirmRegistration,
  RegisterUser,
} from "./dto";
import {
  LoginRequest,
  RegisterRequest,
  ConfirmRegistrationRequest,
} from "./dto/request";
import { PasswordResetRequest } from "./dto/request/passwordResetRequest.dto";
import { CreatePasswordReset } from "./dto/createPasswordReset.dto";
import { PasswordResetResponse } from "./dto/response/passwordResetResponse.dto";
import { ConfirmPasswordResetRequest } from "./dto/request/confirmPasswordResetRequest.dto";
import { ConfirmPasswordResetResponse } from "./dto/response/confirmPasswordResetResponse.dto";
import { ConfirmPasswordReset } from "./dto/confirmPasswordReset.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { TokenRefresh } from "./dto/tokenRefresh.dto";
import { TokenRefreshRequest } from "./dto/request/tokenRefreshRequest.dto";
import { TokenRefreshResponse } from "./dto/response/tokenRefreshResponse.dto";

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
  async register(@Body() dto: RegisterRequest): Promise<RegisterResponse> {
    const input = RegisterUser.from(dto);
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

  @ApiOperation({
    description: "Initiate password reset",
    summary:
      "Initiates the password reset, sends an email. Always returns 200 OK",
  })
  @ApiBody({
    type: PasswordResetRequest,
    description: "Email address of user",
  })
  @ApiOkResponse({
    description:
      "Password reset process initiated. The user with the provided email might not exist.",
    type: PasswordResetResponse,
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
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() body: PasswordResetRequest,
  ): Promise<PasswordResetResponse> {
    const input = CreatePasswordReset.from(body);
    await this.authService.initiatePasswordReset(input);
    return PasswordResetResponse.new();
  }

  @ApiOperation({
    description: "Finalize password reset",
    summary:
      "Confirms the user attempt to change the password, changes the password",
  })
  @ApiBody({
    type: ConfirmPasswordResetRequest,
    description: "Reset token and new password",
  })
  @ApiOkResponse({
    description: "The password has been changed successfully",
    schema: { example: { message: "Password reset successfully" } },
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
  @Post("reset-password/confirm")
  @HttpCode(HttpStatus.OK)
  async confirmResetPassword(
    @Body() dto: ConfirmPasswordResetRequest,
  ): Promise<ConfirmPasswordResetResponse> {
    const input = ConfirmPasswordReset.from(dto);
    await this.authService.confirmPasswordReset(input);
    return ConfirmPasswordResetResponse.new();
  }

  @ApiOperation({ description: "Refreshes the users's access token." })
  @ApiOkResponse({
    description: "Refresh successful.",
    type: TokenRefreshResponse,
  })
  @ApiUnauthorizedResponse({ description: "Token invalid or outdated" })
  @HttpCode(HttpStatus.OK)
  @Post("/refresh")
  async refreshToken(
    @Body() dto: TokenRefreshRequest,
  ): Promise<TokenRefreshResponse> {
    const input = TokenRefresh.from(dto);
    const result = await this.authService.refresh(input);
    return TokenRefreshResponse.from(result);
  }

  @ApiOperation({ description: "Check if user is authenticated" })
  @ApiOkResponse({ description: "User is authenticated" })
  @ApiUnauthorizedResponse({ description: "User is not authenticated" })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post("/me")
  async checkAuthorized() {}
}
