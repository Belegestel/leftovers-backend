import { Body, Post, Controller, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { ConfirmRegistrationDto } from "./dto/confirm-registration.dto";
import {
  ApiOkResponse,
  ApiConflictResponse,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiBody,
} from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";

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
    type: SignupDto,
    description: "User registration data",
  })
  @ApiOkResponse({
    description: "User account successfully created.",
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
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({
    summary: "Log in to user account and return JWT, if account exists.",
  })
  @ApiBody({
    type: LoginDto,
    description: "User login data",
  })
  @ApiOkResponse({
    description: "User logged in.",
    schema: {
      example: {
        accessToken:
          "qUeFkWKTAuDQtyqEwIsCOSTGFslErWADsDfrREoROBYFtSIXykvPJHZvwHwybAUqmxXuMSjFYcqSgRtaXGcHFaawDQnLgfMqfOCV",
      },
    },
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
  @ApiForbiddenResponse({
    description: "User provided invalid credentials",
    schema: {
      example: {
        statusCode: 401,
        message: ["Invalid credentials"],
        error: "Unauthorized",
      },
    },
  })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({
    summary: "Start the signup process to get an email with confirmation link",
  })
  @ApiBody({
    type: SignupDto,
    description: "User registration data",
  })
  @ApiOkResponse({
    description: "User logged in",
    schema: {
      example: {
        message: "Confirmation email sent.",
      },
    },
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
  register(@Body() dto: SignupDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({
    summary: "Confirm registration using email and token",
  })
  @ApiBody({
    type: ConfirmRegistrationDto,
    description: "Email and verification token received via email",
  })
  @ApiOkResponse({
    description: "User account sucessfuly created",
    schema: {
      example: {
        id: 123,
        email: "john.doe@email.com",
      },
    },
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
  @ApiBadRequestResponse({ description: "Invalid or expired token or email " })
  @Post("confirm-registration")
  ConfirmRegistration(@Body() dto: ConfirmRegistrationDto) {
    return this.authService.confirmRegistration(dto);
  }
}
