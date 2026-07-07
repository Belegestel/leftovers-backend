import { Test, TestingModule } from "@nestjs/testing";
import { FilesService } from "./files.service";
import { randomUUID } from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ConfigModule } from "@nestjs/config";

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(),
}));
jest.mock("node:crypto", () => ({
  randomUUID: jest.fn(),
}));
describe("FilesService", () => {
  let service: FilesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    (randomUUID as jest.Mock).mockReturnValue("uuid-123");
    (getSignedUrl as jest.Mock).mockResolvedValue("https://signed-url.com");
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [FilesService],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it("should generate a presigned URL", async () => {
    const key = `folder/images/${randomUUID()}.png`;
    const fileType = "image/png";

    const result = await service.createPresignedUploadUrl(key, fileType);

    expect(result.url).toBe("https://signed-url.com");
    expect(result.key).toBe("folder/images/uuid-123.png");
    expect(randomUUID).toHaveBeenCalled();
    expect(getSignedUrl).toHaveBeenCalledTimes(1);
    expect((getSignedUrl as jest.Mock).mock.calls[0][1]).toBeInstanceOf(
      PutObjectCommand,
    );
  });
});
