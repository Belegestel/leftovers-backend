import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  HttpStatus,
  Post,
  HttpCode,
  Body,
  Param,
  ParseIntPipe,
  ForbiddenException,
} from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-guard";
import { RecipeQueryRequest } from "./dto/requests/recipeQueryRequest.dto";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import type { AuthenticatedRequest } from "../types/authenticated-request.interface";
import { RecipeQueryResponse } from "./dto/responses/recipeQueryResponse.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateRecipeRequest } from "./dto/requests/createRecipeRequest.dto";
import { CreateRecipeResponse } from "./dto/responses/createRecipeResponse.dto";
import { CreateRecipe } from "./dto/createRecipe.dto";
import { SingleRecipeQueryResponse } from "./dto/responses/singleRecipeQueryResponse.dto";
import { RecipeImageUploadRequest } from "./dto/requests/recipeImageUploadRequest.dto";
import { CreateRecipeImageUploadUrl } from "./dto/createRecipeImageUploadUrl.dto";
import { ConfirmReceivedImageRequest } from "./dto/requests/confirmReceivedImageRequest.dto";
import { RecipeImageUploadResponse } from "./dto/responses/recipeImageUploadResponse.dto";
import { ConfirmImageResponse } from "./dto/responses/imageConfirmResponse.dto";
import { CategoriesResponse } from "./dto/responses/categoriesResponse.dto";
import { BookmarkRecipe } from "./dto/bookmarkRecipe.dto";
import { UnbookmarkRecipe } from "./dto/unbookmarkRecipe.dto";
import { RateRecipeRequest } from "./dto/requests/rateRecipeRequest.dto";
import { RateRecipe } from "./dto/rateRecipe.dto";
import { EditRecipeRequest } from "./dto/requests/editRecipeRequest.dto";
import { EditRecipe } from "./dto/editRecipe.dto";

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
    type: RecipeQueryResponse,
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

  @ApiOperation({
    summary: "Create a new recipe",
    description:
      "Creates a new recipe owned by the authenticated user. Ingredients and steps must contain at least one item each.",
  })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateRecipeRequest,
  })
  @ApiCreatedResponse({
    description: "Recipe created successfully",
    type: CreateRecipeResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad request data",
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          "title must be shorter than or equal to 100 characters",
          "prepTime must not be less than 3",
        ],
        error: "Bad Request",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Missing or invalid JWT token",
    schema: {
      example: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "Unauthorized",
      },
    },
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRecipe(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateRecipeRequest,
  ): Promise<CreateRecipeResponse> {
    const userId = req.user.userId;
    const input = CreateRecipe.from(dto);
    const recipe = await this.recipesService.createRecipe(userId, input);
    return CreateRecipeResponse.from(recipe);
  }

  @ApiOperation({ summary: "Returns a list of recipe categories" })
  @ApiOkResponse({
    description: "List has been returned",
    type: CategoriesResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Get("/categories")
  async getCategories(): Promise<CategoriesResponse> {
    const categories = await this.recipesService.getRecipeCategories();
    return CategoriesResponse.from(categories);
  }
  @ApiOperation({
    summary: "Get a single recipe by id",
    description:
      "Get a single recipe by ID. If user is not logged in, only public recieps are available. Otherwise, also their private recipes are available.",
  })
  @ApiOkResponse({
    description: "Recipe found and returned succesfully",
    type: SingleRecipeQueryResponse,
  })
  @ApiNotFoundResponse({
    description: "Recipe not found",
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: "Recipe not found",
        error: "Not Found",
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Access to this recipe is forbidden for current user",
    schema: {
      example: {
        statusCode: HttpStatus.FORBIDDEN,
        message: "You do not have access to this recipe",
        error: "Forbidden",
      },
    },
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Recipe ID",
    example: 1,
  })
  @Get(":id")
  @UseGuards(OptionalJwtAuthGuard)
  async findById(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<SingleRecipeQueryResponse> {
    const userId = req.user?.userId;
    const recipe = await this.recipesService.findById(id, userId);
    return SingleRecipeQueryResponse.from(recipe);
  }

  @ApiOperation({
    summary: "Request new image upload URL",
    description:
      "Generates a presigned URL to allow for image upload for the recipe",
  })
  @ApiBody({
    type: RecipeImageUploadRequest,
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Presigned URL has been generated",
    type: RecipeImageUploadResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad request data",
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        error: "Bad Request",
      },
    },
  })
  @ApiNotFoundResponse({
    description: "The recipe does not exist",
  })
  @ApiForbiddenResponse({
    description: "The user cannot edit the recipe",
  })
  @ApiOkResponse()
  @Post(":id/image-upload-url")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getRecipeImageUploadUrl(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Body() body: RecipeImageUploadRequest,
  ): Promise<RecipeImageUploadResponse> {
    const userId = req.user.userId;
    const input = CreateRecipeImageUploadUrl.from(id, body, userId);
    const res = await this.recipesService.createRecipeImageUploadUrl(input);
    return RecipeImageUploadResponse.from(res);
  }

  @Post(":id/image-confirm")
  @ApiBearerAuth()
  @ApiBody({ type: ConfirmReceivedImageRequest })
  @ApiOkResponse({ type: ConfirmImageResponse })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async confirmReceivedImageUpload(
    @Param("id") id: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: ConfirmReceivedImageRequest,
  ): Promise<ConfirmImageResponse> {
    const userId = req.user.userId;
    const res = await this.recipesService.confirmReceivedImageUpload(
      id,
      userId,
      dto.key,
    );
    return ConfirmImageResponse.from(res);
  }

  @ApiOperation({
    summary: "Authenticated user bookmarks a recipe",
  })
  @ApiOkResponse({ description: "Recipe bookmarked succesfully" })
  @HttpCode(HttpStatus.OK)
  @Post(":id/bookmark")
  @UseGuards(JwtAuthGuard)
  async bookmarkRecipe(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const input = BookmarkRecipe.from(id, req.user.userId);
    await this.recipesService.bookmarkRecipe(input);
  }

  @ApiOperation({
    summary: "Authenticated user bookmarks a recipe",
  })
  @ApiOkResponse({ description: "Recipe bookmarked succesfully" })
  @HttpCode(HttpStatus.OK)
  @Post(":id/unbookmark")
  @UseGuards(JwtAuthGuard)
  async unbookmarkRecipe(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const input = UnbookmarkRecipe.from(id, req.user.userId);
    await this.recipesService.unbookmarkRecipe(input);
  }

  @ApiOperation({
    summary: "Authenticated user rates a recipe or replaces previous rating",
  })
  @ApiBody({ type: RateRecipeRequest })
  @ApiOkResponse({ description: "The recipe has been rated." })
  @HttpCode(HttpStatus.OK)
  @Post(":id/rate")
  @UseGuards(JwtAuthGuard)
  async rateRecipe(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: RateRecipeRequest,
  ) {
    const input = RateRecipe.from(dto, req.user.userId, id);
    await this.recipesService.rateRecipe(input);
  }

  @ApiOperation({ summary: "Authenticated user edits their own recipe" })
  @ApiOkResponse({ description: "Recipe has been edited" })
  @ApiForbiddenResponse({
    description: "User has no permissions to edit the recipe",
  })
  @HttpCode(HttpStatus.OK)
  @Post(":id/edit")
  @UseGuards(JwtAuthGuard)
  async editRecipe(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: EditRecipeRequest,
  ) {
    const input = EditRecipe.from(id, dto, req.user.userId);
    const res = await this.recipesService.editRecipe(input);
    if (!res) {
      return new ForbiddenException("Can't edit the recipe");
    }
  }

  @ApiOperation({ summary: "Authenticated user deletes their own recipe" })
  @ApiOkResponse({ description: "Recipe has been deleted" })
  @ApiForbiddenResponse({
    description: "User has no permissions to delete the recipe",
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post(":id/delete")
  async deleteRecipe(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const res = await this.recipesService.deleteRecipe(id, req.user.userId);
    if (!res) {
      throw new ForbiddenException("Can't delete the recipe");
    }
  }
}
