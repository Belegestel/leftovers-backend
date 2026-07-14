import { ApiProperty } from "@nestjs/swagger";

export class SignupResult {
  @ApiProperty({
    description: "User ID",
    example: 127,
  })
  id: number;

  @ApiProperty({
    description: "User email",
    example: "john.doe@email.com",
  })
  email: string;

  private constructor(id: number, email: string) {
    this.id = id;
    this.email = email;
  }
  static from(id: number, email: string): SignupResult {
    return new SignupResult(id, email);
  }
}
