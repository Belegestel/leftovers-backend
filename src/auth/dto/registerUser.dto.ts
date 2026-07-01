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

  static from(registerRequest: RegisterRequest): RegisterUser {
    return {
      email: registerRequest.email,
      password: registerRequest.password,
      name: registerRequest.name,
    };
  }
}
