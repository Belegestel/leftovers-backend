import { PresignedUrlResult } from "../presignedUrlResult.dto";

export class PresignedUrlResponse {
  url: string;
  key: string;

  static from(dto: PresignedUrlResult): PresignedUrlResponse {
    return {
      url: dto.url,
      key: dto.key,
    };
  }
}
