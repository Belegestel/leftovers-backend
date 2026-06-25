import { Controller, Get, UseGuards, Req, Query } from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { OptionalJwtAuthGuard } from "src/auth/optional-jwt-guard";
import { toRecipeDetailsDto, toRecipeListDto } from "./recipes.mapper";
import { RecipeFiltersDto } from "./dto/recipe-filters.dto";
import { RecipeSearchDto } from "./dto/recipe-search.dto";

@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Req() req,
    @Query() filters: RecipeFiltersDto & RecipeSearchDto,
    @Query("details") details?: string,
  ) {
    const userId = req.user?.userId ? Number(req.user.userId) : undefined;
    const recipes = await this.recipesService.findAll(userId, filters);
    const isDetails = details === "true";
    return recipes.map(isDetails ? toRecipeDetailsDto : toRecipeListDto);
  }
}
