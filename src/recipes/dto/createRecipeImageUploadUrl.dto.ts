import { RecipeImageUploadRequest } from "./requests/recipeImageUploadRequest.dto";

export class CreateRecipeImageUploadUrl {
  id: number;
  userId: number;
  fileName: string;
  fileType: string;

  static from(
    id: number,
    dto: RecipeImageUploadRequest,
    userId: number,
  ): CreateRecipeImageUploadUrl {
    return {
      id,
      userId,
      fileName: dto.fileName,
      fileType: dto.fileType,
    };
  }
}
