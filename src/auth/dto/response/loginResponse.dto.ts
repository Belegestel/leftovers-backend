import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LoginResultDto } from "./loginResult.dto";

export class LoginResponseDto {
  @ApiProperty({
    example: "VGzaxSmzmSKULOLvrHrdFDCjHQywmd",
    description: "JWT access token",
  })
  @IsString()
  accessToken: string;

  static from(loginResult: LoginResultDto): LoginResponseDto {
    return { accessToken: loginResult.accessToken };
  }
}
