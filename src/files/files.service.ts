import { Injectable } from "@nestjs/common";
import { PresignedUrlResult } from "./dto/presignedUrlResult.dto";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { CreatePresignedUrl } from "./dto/createPresignedUrl.dto";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class FilesService {
  private s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const aws_data = {
      region: this.config.getOrThrow<string>("AWS_REGION"),
      accessKeyId: this.config.getOrThrow<string>("AWS_ACCESS_KEY_ID"),
      secretAccessKey: this.config.getOrThrow<string>("AWS_SECRET_ACCESS_KEY"),
    };

    this.s3 = new S3Client({
      region: aws_data.region!,
      credentials: {
        accessKeyId: aws_data.accessKeyId!,
        secretAccessKey: aws_data.secretAccessKey!,
      },
    });
    this.bucket = this.config.getOrThrow<string>("AWS_S3_BUCKET");
  }

  async createPresignedUploadUrl(
    dto: CreatePresignedUrl,
  ): Promise<PresignedUrlResult> {
    const fileExtension = path.extname(dto.fileName);
    const key = `${dto.folder}/${randomUUID()}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: dto.fileType,
    });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 60 * 5 });
    return PresignedUrlResult.from(url, key);
  }

  async createPresignedGetUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 5 * 60 });
    return url;
  }
}
