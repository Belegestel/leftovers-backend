import { ApiProperty } from "@nestjs/swagger";
import { RecipeSuggestions } from "../recipeSuggestions.dto";

export class RecipeSuggestionsResponse {
  @ApiProperty()
  names: string[];

  private constructor(names: string[]) {
    this.names = names;
  }

  static from(dto: RecipeSuggestions): RecipeSuggestionsResponse {
    return new RecipeSuggestionsResponse(dto.names);
  }
}
