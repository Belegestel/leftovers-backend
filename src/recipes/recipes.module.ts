import { Module } from "@nestjs/common";
import { RecipesController } from "./recipes.controller";
import { RecipesService } from "./recipes.service";
import { PrismaModule } from "../prisma/prisma.module";
import { RecipesRepository } from "./recipes.repository";
import { FilesModule } from "src/files/files.module";

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository],
})
export class RecipesModule {}
