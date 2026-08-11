import { Module } from "@nestjs/common";
import { RecipesController } from "./recipes.controller";
import { RecipesService } from "./recipes.service";
import { PrismaModule } from "../prisma/prisma.module";
import { RecipesRepository } from "./recipes.repository";
import { FilesModule } from "src/files/files.module";
import { RecipesCacheService } from "./recipes-cache.service";
import { NotificationsModule } from "src/notifications/notifications.module";

@Module({
  imports: [PrismaModule, FilesModule, NotificationsModule],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository, RecipesCacheService],
})
export class RecipesModule {}
