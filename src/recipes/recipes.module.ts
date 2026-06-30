import { Module } from "@nestjs/common";
import { RecipesController } from "./recipes.controller";
import { RecipesService } from "./recipes.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { RecipesRepository } from "./recipes.repository";

@Module({
  imports: [PrismaModule],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository],
})
export class RecipesModule {}
