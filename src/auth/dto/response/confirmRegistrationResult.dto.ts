import { ApiProperty } from "@nestjs/swagger";

export class ConfirmRegistrationResult {
  @ApiProperty({
    description: "User ID",
    example: 7438,
  })
  id: number;

  @ApiProperty({
    description: "User email",
    example: "john.doe@example.com",
  })
  email: string;
}
