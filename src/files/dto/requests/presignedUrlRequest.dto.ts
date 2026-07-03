import { IsIn, IsMimeType, IsNotEmpty, IsString } from "class-validator";

export class PresignedUrlRequest {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsMimeType()
  @IsIn(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"])
  fileType: string;

  @IsString()
  folder: string;
}
