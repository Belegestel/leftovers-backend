import { ApiProperty } from "@nestjs/swagger";

export class ConfirmImageResponse {
  @ApiProperty({
    description: "Presigned GET URL to the uploaded file",
  })
  imageUrl: string;

  private constructor(imageUrl: string) {
    this.imageUrl = imageUrl;
  }

  static from(imageUrl: string): ConfirmImageResponse {
    return new ConfirmImageResponse(imageUrl);
  }
}
