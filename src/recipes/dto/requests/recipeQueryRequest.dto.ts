import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
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
  details?: boolean;

  @ApiPropertyOptional({ example: "true" })
  @IsOptional()
  @ToBoolean()
  saved?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  dateOrderIncr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  ratingOrderIncr?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  authored?: boolean;
}
