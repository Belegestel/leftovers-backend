import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsBoolean,
} from "class-validator";

export class RecipeQueryRequest {
  // Filter
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;
  
  // Search
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  steps?: string;

  @ApiPropertyOptional({ example: "true" })
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  details?: boolean;

  @ApiPropertyOptional({ example: "true" })
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  saved?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === "asc")
  dateOrderIncr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === "asc")
  ratingOrderIncr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  authored?: boolean;
}
