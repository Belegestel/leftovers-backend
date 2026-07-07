import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../../src/prisma/prisma.service";
import { mockEmailService } from "../unit/mocks/mockEmailService";
import { EmailService } from "../../src/email/email.service";
import { FilesService } from "../../src/files/files.service";
import { mockFilesService } from "../unit/mocks/mockFilesService";

mockEmailService.sendEmail.mockResolvedValue(undefined);

mockFilesService.createPresignedUploadUrl.mockResolvedValue({
  url: "https://mock-s3.local/upload",
  key: "recipes/1/image.jpg",
});
mockFilesService.createPresignedGetUrl.mockResolvedValue(
  "https://mock-s3.local/image.jpg",
);

export async function createE2EApp(): Promise<{
  app: INestApplication;
  prisma: PrismaService;
  moduleRef: TestingModule;
}> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(EmailService)
    .useValue(mockEmailService)
    .overrideProvider(FilesService)
    .useValue(mockFilesService)
    .compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  const prisma = app.get(PrismaService);

  return { app, prisma, moduleRef };
}
