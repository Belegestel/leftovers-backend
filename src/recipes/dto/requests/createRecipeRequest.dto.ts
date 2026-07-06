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

export class CreateRecipeRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsEnum(RecipeCategory)
  category: RecipeCategory;

  @IsInt()
  @Min(3)
  @Max(240)
  prepTime: number;

  @IsInt()
  @Min(1)
  @Max(10)
  servings: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  ingredients: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  steps: string[];
}
