import { ApiProperty } from "@nestjs/swagger";

export class ConfirmRegistrationAttemptDto {
  @ApiProperty({
    example: "john.doe@email.com"
  })
  email: string;

  @ApiProperty({
    example: "l1kj2h3235"
  })
  token: string;
}
