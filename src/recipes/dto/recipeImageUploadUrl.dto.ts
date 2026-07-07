import { PresignedUrlResult } from "src/files/dto/presignedUrlResult.dto";

export class RecipeImageUploadUrl {
  url: string;
  key: string;

  private constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  static from(dto: PresignedUrlResult): RecipeImageUploadUrl {
    return new RecipeImageUploadUrl(dto.url, dto.key);
  }
}
