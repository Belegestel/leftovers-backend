import { ApiProperty } from "@nestjs/swagger";

export class SignupResponseDto {
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
}
