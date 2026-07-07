import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ConfirmPasswordResetRequest {
  @ApiProperty()
  @IsString()
  token: string;
  @ApiProperty()
  @MinLength(8)
  newPassword: string;
}
