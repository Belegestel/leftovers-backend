import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginResult {
  @ApiProperty({
    description: "User password",
    example: "password123"
  })
  @IsString()
  accessToken: string;
}
