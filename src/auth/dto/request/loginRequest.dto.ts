import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class LoginRequestDto {
  @ApiProperty({
    example: "john.doe@email.com",
    description: "User email",
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: "password123!",
    description: "User password",
  })
  @IsString()
  password: string;
}
