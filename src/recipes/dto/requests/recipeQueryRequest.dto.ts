import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString, IsBoolean } from "class-validator";
import { ToBoolean } from "../../../common/toBoolean";

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
  @ToBoolean()
  @IsBoolean()
  details?: boolean;

  @ApiPropertyOptional({ example: "true" })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  saved?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  dateOrderIncr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ratingOrderIncr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  authored?: boolean;
}
