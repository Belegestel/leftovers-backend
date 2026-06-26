import { ApiProperty } from "@nestjs/swagger";

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Message to user',
    example: 'Confirmation email sent.'
  })
  message: string
}
