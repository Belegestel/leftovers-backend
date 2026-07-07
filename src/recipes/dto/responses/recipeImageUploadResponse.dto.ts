import { ApiProperty } from "@nestjs/swagger";
import { RecipeImageUploadUrl } from "../recipeImageUploadUrl.dto";

export class RecipeImageUploadResponse {
  @ApiProperty()
  url: string;
  @ApiProperty()
  key: string;

  private constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  static from(dto: RecipeImageUploadUrl): RecipeImageUploadResponse {
    return new RecipeImageUploadResponse(dto.url, dto.key);
  }
}
