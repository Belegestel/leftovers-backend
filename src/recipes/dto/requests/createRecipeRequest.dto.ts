import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { RecipeCategory } from "../../recipe-categories.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRecipeRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty()
  description: string;

  @IsEnum(RecipeCategory)
  @ApiProperty()
  category: RecipeCategory;

  @IsInt()
  @Min(3)
  @Max(240)
  @ApiProperty()
  prepTime: number;

  @IsInt()
  @Min(1)
  @Max(10)
  @ApiProperty()
  servings: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty()
  ingredients: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty()
  steps: string[];
}
