import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class ConfirmRegistrationRequest {
  @ApiProperty({
    example: "john.doe@email.com"
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: "l1kj2h3235"
  })
  @IsString()
  token: string;
}
