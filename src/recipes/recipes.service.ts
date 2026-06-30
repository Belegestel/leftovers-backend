import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RecipeQueryRequestDto } from "./dto/requests/recipeQueryRequest.dto";
import { RecipesRepository } from "./recipes.repository";
import { RecipeQueryAttemptDto } from "./dto/requests/recipeQueryAttempt.dto";
import { RecipeQueryResultDto } from "./dto/responses/recipeQueryResultDto";

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService, private recipesRepository: RecipesRepository) {}
  async findAll(userId?: number, filters?: RecipeQueryRequestDto): Promise<RecipeQueryResultDto> {
    const input = RecipeQueryAttemptDto.from(userId, filters);
    const result = await this.recipesRepository.findAll(userId, input);
    return RecipeQueryResultDto.from(result);
  }
}
