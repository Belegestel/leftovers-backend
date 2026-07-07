import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateSignupRequest {
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
  passwordHash: string;

  @ApiProperty({
    description: "User registration token",
    example: "cVbhjhGFdrtGYHgbVFcx",
  })
  token: string;

  @ApiProperty({
    description: "Token expiration date",
    example: new Date("2027-07-07"),
  })
  expiresAt: Date;

  private constructor(
    email: string,
    name: string,
    passwordHash: string,
    token: string,
    expiresAt: Date,
  ) {
    this.email = email;
    this.name = name;
    this.passwordHash = passwordHash;
    this.token = token;
    this.expiresAt = expiresAt;
  }

  static from(
    email: string,
    name: string,
    hashedPassword: string,
    token: string,
    expiresAt: Date,
  ): CreateSignupRequest {
    return new CreateSignupRequest(
      email,
      name,
      hashedPassword,
      token,
      expiresAt,
    );
  }
}
