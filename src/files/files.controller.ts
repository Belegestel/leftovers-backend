import { Body, Controller, Post } from "@nestjs/common";
import { FilesService } from "./files.service";
import { PresignedUrlRequest } from "./dto/requests/presignedUrlRequest.dto";
import { CreatePresignedUrl } from "./dto/createPresignedUrl.dto";
import { PresignedUrlResponse } from "./dto/responses/presignedUrlResponse.dto";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("presigned-url")
  async createPresignedUrl(@Body() dto: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    const input = CreatePresignedUrl.from(dto);
    const result = await this.filesService.createPresignedUploadUrl(input);
    const response = PresignedUrlResponse.from(result);
    return response;
  }
}
