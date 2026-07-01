import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  HttpStatus,
} from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-guard";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import type { AuthenticatedRequest } from "../types/authenticated-request.interface";
import { RecipeQueryResponse } from "./dto/responses/recipeQueryResponse.dto";

@ApiTags("Recipes")
@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOperation({
    summary:
      "Get list of public recipes with optional filtering and searching. If the user is authenticated, it also provides their private recipes.",
  })
  @ApiQuery({
    name: "details",
    required: false,
    type: String,
    example: "true",
    description:
      "If true, returns a detailed recipe representation instead of a simplified list view",
  })
  @ApiOkResponse({
    description:
      "List of recipes (summary or detailed, depending on the `details` flag)",
    schema: {
      example: [
        {
          id: 1,
          title: "Pizza",
          category: "Italian",
          rating: 4,
          created_at: "2020-02-02T20:20:20.200Z",
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid query parameters",
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ["rating must be a number"],
        error: "Bad Request",
      },
    },
  })
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() filters: RecipeQueryRequest,
  ): Promise<RecipeQueryResponse> {
    const userId = req.user?.userId;
    const recipes = await this.recipesService.findAll(userId, filters);
    const isDetails = filters.details === true;
    return RecipeQueryResponse.from(recipes, isDetails);
  }
}
