import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { FilesService } from "./files.service";
import { PresignedUrlRequest } from "./dto/requests/presignedUrlRequest.dto";
// import { CreatePresignedUrl } from "./dto/createPresignedUrl.dto";
import { PresignedUrlResponse } from "./dto/responses/presignedUrlResponse.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { randomUUID } from "crypto";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post("presigned-url")
  async createPresignedUrl(
    @Body() dto: PresignedUrlRequest,
  ): Promise<PresignedUrlResponse> {
    // const input = CreatePresignedUrl.from(dto);
    const result = await this.filesService.createPresignedUploadUrl(
      `${randomUUID()}-${dto.fileName}`,
      dto.fileType,
    );
    const response = PresignedUrlResponse.from(result);
    return response;
  }
}
