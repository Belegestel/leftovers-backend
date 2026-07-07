import { PresignedUrlResult } from "../presignedUrlResult.dto";

export class PresignedUrlResponse {
  url: string;
  key: string;

  private constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  static from(dto: PresignedUrlResult): PresignedUrlResponse {
    return new PresignedUrlResponse(dto.url, dto.key);
  }
}
