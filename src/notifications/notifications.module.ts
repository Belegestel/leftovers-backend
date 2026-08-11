import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { NotificationsRepository } from "./notifications.repository";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";
import { NotificationsGateway } from "./notifications.gateway";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    PrismaService,
    NotificationsGateway,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
