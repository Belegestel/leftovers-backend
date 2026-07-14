import { ApiProperty } from "@nestjs/swagger";
import { IsMimeType, IsString, IsIn, } from "class-validator";

export class RecipeImageUploadRequest {
  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsMimeType()
  @IsIn(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"])
  fileType: string;
}
