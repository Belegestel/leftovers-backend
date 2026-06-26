import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginAttemptDto {
  @ApiProperty({
    description: "User email",
    example: "john.doe@email.com",
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: "User password",
    example: "password123"
  })
  @IsString()
  password: string;
}
