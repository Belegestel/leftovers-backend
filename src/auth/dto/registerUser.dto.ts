import { ApiProperty } from "@nestjs/swagger";
import { RegisterRequest } from "./request/registerRequest.dto";

export class RegisterUser {
  @ApiProperty({
    example: "john.doe@email.com",
    description: "User email.",
  })
  email: string;

  @ApiProperty({
    example: "MySecretPassword123!",
    description: "User password of length 8 or more.",
  })
  password: string;

  private constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  static from(registerRequest: RegisterRequest): RegisterUser {
    return new RegisterUser(
      registerRequest.email,
      registerRequest.password,
    );
  }
}
