import { RecipeSuggestionsRequest } from "./requests/recipeSuggestionsRequest.dto";

export class GetRecipeSuggestions {
  query: string;
  userId: number | undefined;

  private constructor(query: string, userId: number | undefined) {
    this.query = query;
    this.userId = userId;
  }

  static from(
    dto: RecipeSuggestionsRequest,
    userId: number | undefined,
  ): GetRecipeSuggestions {
    return new GetRecipeSuggestions(dto.query, userId);
  }
}
