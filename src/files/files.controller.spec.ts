import { Test, TestingModule } from "@nestjs/testing";
import { FilesController } from "./files.controller";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { mockFilesService } from "../../test/unit/mocks/mockFilesService";
import { FilesService } from "./files.service";

describe("FilesController", () => {
  let controller: FilesController;
  let service: FilesService;

  const jwtAuthGuardMock = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [{ provide: FilesService, useValue: mockFilesService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtAuthGuardMock)
      .compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);
  });

  it("should call service and return response DTO", async () => {
    const dto = {
      fileName: "image.png",
      fileType: "image/png",
      folder: "images",
    };
    const serviceResult = {
      url: "https://signed-url.com",
      key: "images/uuid.png",
    };
    mockFilesService.createPresignedUploadUrl.mockResolvedValue(serviceResult);

    const result = await controller.createPresignedUrl(dto);

    expect(service.createPresignedUploadUrl).toHaveBeenCalled();
    expect(result).toEqual(serviceResult);
  });
});
