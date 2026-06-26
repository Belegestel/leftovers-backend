import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterRequestDto {
  @ApiProperty({
    example: "john.doe@email.com",
    description: "User email.",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "MySecretPassword123!",
    description: "User password of length 8 or more.",
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: "John Doe",
    description: "User name.",
  })
  @IsString()
  name: string;
}
