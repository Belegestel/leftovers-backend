import { PresignedUrlResult } from "src/files/dto/presignedUrlResult.dto";

export class RecipeImageUploadUrl {
  url: string;
  key: string;

  static from(dto: PresignedUrlResult): RecipeImageUploadUrl {
    return { url: dto.url, key: dto.key };
  }
}
