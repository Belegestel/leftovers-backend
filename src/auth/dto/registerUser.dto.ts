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

  @ApiProperty({
    example: "John Doe",
    description: "User name.",
  })
  name: string;

  private constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }

  static from(registerRequest: RegisterRequest): RegisterUser {
    return new RegisterUser(
      registerRequest.email,
      registerRequest.password,
      registerRequest.name,
    );
  }
}
