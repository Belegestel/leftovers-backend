import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class SignupRequestCreateAttemptDto {
  constructor(
    email: string,
    name: string,
    hashedPassword: string,
    token: string,
    expiresAt: Date,
  ) {
    this.email = email;
    this.name = name;
    this.password_hash = hashedPassword;
    this.token = token;
    this.expires_at = expiresAt;
  }

  @ApiProperty({
    description: "User email",
    example: "john.doe@email.com",
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User name",
    example: "John Doe",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Password hash",
    example: "grfdgHJhGFdrty",
  })
  @IsString()
  password_hash: string;

  @ApiProperty({
    description: "User registration token",
    example: "cVbhjhGFdrtGYHgbVFcx",
  })
  token: string;

  @ApiProperty({
    description: "Token expiration date",
    example: new Date("2027-07-07"),
  })
  expires_at: Date;
}
