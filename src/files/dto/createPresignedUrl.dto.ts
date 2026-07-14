import { PresignedUrlRequest } from "./requests/presignedUrlRequest.dto";

export class CreatePresignedUrl {
  fileName: string;
  fileType: string;

  private constructor(fileName: string, fileType: string) {
    this.fileName = fileName;
    this.fileType = fileType;
  }

  static from(dto: PresignedUrlRequest): CreatePresignedUrl {
    return new CreatePresignedUrl(dto.fileName, dto.fileType);
  }
}
