import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestDto {
  @ApiProperty({
    example: "john.doe@email.com",
    description: "User email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123!",
    description: "User password",
  })
  @IsString()
  password: string;
}
