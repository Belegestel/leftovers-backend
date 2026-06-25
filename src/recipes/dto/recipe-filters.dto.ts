import { Transform } from "class-transformer";
import { IsOptional, IsString, IsInt, Min, Max } from "class-validator";

export class RecipeFiltersDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(({ value }) => {
    Number(value);
  })
  @IsInt()
  @Min(0)
  @Max(5)
  rating: number;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate?: Date

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;
}
