import { ApiProperty } from "@nestjs/swagger";
import { PresignedUrlResult } from "../presignedUrlResult.dto";

export class PresignedUrlResponse {
  @ApiProperty()
  url: string;

  @ApiProperty()
  key: string;

  private constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  static from(dto: PresignedUrlResult): PresignedUrlResponse {
    return new PresignedUrlResponse(dto.url, dto.key);
  }
}
