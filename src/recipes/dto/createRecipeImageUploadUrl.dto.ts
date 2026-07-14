import { RecipeImageUploadRequest } from "./requests/recipeImageUploadRequest.dto";

export class CreateRecipeImageUploadUrl {
  id: number;
  userId: number;
  fileName: string;
  fileType: string;

  private constructor(
    id: number,
    userId: number,
    fileName: string,
    fileType: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.fileName = fileName;
    this.fileType = fileType;
  }

  static from(
    id: number,
    dto: RecipeImageUploadRequest,
    userId: number,
  ): CreateRecipeImageUploadUrl {
    return new CreateRecipeImageUploadUrl(
      id,
      userId,
      dto.fileName,
      dto.fileType,
    );
  }
}
