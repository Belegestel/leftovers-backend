import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TokenRefreshRequest {
  @ApiProperty({ description: "Original refresh token" })
  @IsString()
  token: string;
}
