import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ConfirmRegistrationDto {
  @ApiProperty({
    example: "john.doe@email.com"
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "l1kj2h3235"
  })
  @IsString()
  token: string;
}
