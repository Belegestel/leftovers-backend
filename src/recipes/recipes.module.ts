import { Module } from "@nestjs/common";
import { RecipesController } from "./recipes.controller";
import { RecipesService } from "./recipes.service";
import { PrismaModule } from "../prisma/prisma.module";
import { RecipesRepository } from "./recipes.repository";
import { FilesModule } from "src/files/files.module";
import { RecipesCacheService } from "./recipes-cache.service";
import { NotificationsService } from "src/notifications/notifications.service";

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository, RecipesCacheService, NotificationsService],
})
export class RecipesModule {}
