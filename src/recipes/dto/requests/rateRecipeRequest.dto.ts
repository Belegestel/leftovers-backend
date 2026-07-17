import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Max, Min } from "class-validator";

export class RateRecipeRequest {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(5)
  value: number;
}
