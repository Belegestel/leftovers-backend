import { RecipeImageUploadUrl } from "../recipeImageUploadUrl.dto";

export class RecipeImageUploadResponse {
  url: string;
  key: string;

  static from(dto: RecipeImageUploadUrl): RecipeImageUploadResponse {
    return { url: dto.url, key: dto.key };
  }
}
