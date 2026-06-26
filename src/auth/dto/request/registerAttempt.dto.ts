import { ApiProperty } from "@nestjs/swagger";

export class RegisterAttemptDto {
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
}
