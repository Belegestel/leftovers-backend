import { ApiProperty } from "@nestjs/swagger";

export class ConfirmRegistrationResponseDto {
  @ApiProperty({
    description: "User ID",
    example: 5432,
  })
  id: number;

  @ApiProperty({
    description: "User email",
    example: "john.doe@email.com",
  })
  email: string;
}
