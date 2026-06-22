import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../../src/prisma/prisma.service";

export async function createE2EApp(): Promise<{
  app: INestApplication;
  prisma: PrismaService;
  moduleRef: TestingModule;
}> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

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
