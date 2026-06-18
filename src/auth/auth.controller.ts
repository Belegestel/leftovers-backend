import { Body, Post, Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import {
  ApiOkResponse,
  ApiConflictResponse,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "Create a new user account, if not exists.",
  })
  @ApiOkResponse({
    description: "User account successfully created.",
  })
  @ApiBadRequestResponse({
    description: "Invalid input data - validation error",
    schema: {
      example: {
        statusCode: 400,
        message: ["password must be longer than or equal to 8 characters"],
        error: "Bad request",
      },
    },
  })
  @ApiConflictResponse({
    description: "User email already exists or the input is invalid",
    schema: {
      example: {
        statusCode: 409,
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
  @ApiOkResponse({
    description: "User logged in.",
    schema: {
      example: {
        accessToken: "qUeFkWKTAuDQtyqEwIsCOSTGFslErWADsDfrREoROBYFtSIXykvPJHZvwHwybAUqmxXuMSjFYcqSgRtaXGcHFaawDQnLgfMqfOCV"
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Invalid input data - validation error",
    schema: {
      example: {
        statusCode: 400,
        message: ["email must be an email"],
        error: "Bad request",
      },
    },
  })
  @ApiForbiddenResponse({
    description: "User provided invalid credentials",
    schema: {
      example: {
        statusCode: 403,
        message: ["Invalid credentials"],
        error: "Forbidden",
      },
    },
  })
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
