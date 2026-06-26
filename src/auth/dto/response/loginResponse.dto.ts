import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
  @ApiProperty({
    example: "VGzaxSmzmSKULOLvrHrdFDCjHQywmd",
    description: "JWT access token",
  })
  @IsString()
  accessToken: string;
}
