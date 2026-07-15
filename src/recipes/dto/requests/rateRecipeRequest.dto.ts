import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class RateRecipeRequest {
  @ApiProperty()
  @IsNumber()
  value: number;
}
