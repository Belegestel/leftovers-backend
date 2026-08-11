import { RecipeSuggestionsRequest } from "./requests/recipeSuggestionsRequest.dto";

export class GetRecipeSuggestions {
  query: string;
  userId: number;

  private constructor(query: string, userId: number) {
    this.query = query;
    this.userId = userId;
  }

  static from(dto: RecipeSuggestionsRequest, userId: number): GetRecipeSuggestions {
    return new GetRecipeSuggestions(dto.query, userId);
  }
}
