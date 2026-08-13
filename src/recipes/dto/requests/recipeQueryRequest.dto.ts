import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ToBoolean } from "../../../common/toBoolean";
import { Transform } from "class-transformer";

export class RecipeQueryRequest {
  // Pagination

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === undefined ? 0 : Number(value)))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value === undefined ? 20 : Number(value)))
  @IsNumber()
  @IsOptional()
  limit?: number;

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
  @ToBoolean(true)
  details?: boolean;

  @ApiPropertyOptional({ example: "true" })
  @IsOptional()
  @ToBoolean(true)
  saved?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean(true)
  dateOrderIncr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean(true)
  ratingOrderIncr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @ToBoolean(true)
  authored?: boolean;
}
