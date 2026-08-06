import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { RecipeCategory } from "../../recipe-categories.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class EditRecipeRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  @ApiPropertyOptional()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @IsEnum(RecipeCategory)
  @ApiPropertyOptional()
  @IsOptional()
  category?: RecipeCategory;

  @IsInt()
  @Min(3)
  @Max(240)
  @ApiPropertyOptional()
  @IsOptional()
  prepTime?: number;

  @IsInt()
  @Min(1)
  @Max(10)
  @ApiPropertyOptional()
  @IsOptional()
  servings?: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiPropertyOptional()
  @IsOptional()
  ingredients?: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiPropertyOptional()
  @IsOptional()
  steps?: string[];

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    typeof value === "boolean" ? value : value === "true",
  )
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
