import { ApiProperty } from "@nestjs/swagger";

export class ConfirmImageResponse {
  @ApiProperty({
    description: "Presigned GET URL to the uploaded file",
  })
  imageUrl: string;
  static from(imageUrl: string): ConfirmImageResponse {
    return { imageUrl };
  }
}
