import { Injectable } from "@nestjs/common";
import { PresignedUrlResult } from "./dto/presignedUrlResult.dto";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class FilesService {
  private s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const awsData = {
      region: this.config.getOrThrow<string>("AWS_REGION"),
      accessKeyId: this.config.getOrThrow<string>("AWS_ACCESS_KEY_ID"),
      secretAccessKey: this.config.getOrThrow<string>("AWS_SECRET_ACCESS_KEY"),
    };

    this.s3 = new S3Client({
      region: awsData.region!,
      credentials: {
        accessKeyId: awsData.accessKeyId!,
        secretAccessKey: awsData.secretAccessKey!,
      },
    });
    this.bucket = this.config.getOrThrow<string>("AWS_S3_BUCKET");
  }

  async createPresignedUploadUrl(
    key: string,
    contentType: string,
  ): Promise<PresignedUrlResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
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
