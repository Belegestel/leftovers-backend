import { PresignedUrlRequest } from "./requests/presignedUrlRequest.dto";

export class CreatePresignedUrl {
  fileName: string;
  fileType: string;
  folder: string;

  static from(dto: PresignedUrlRequest): CreatePresignedUrl {
    return {
      fileName: dto.fileName,
      fileType: dto.fileType,
      folder: dto.folder,
    };
  }
}
