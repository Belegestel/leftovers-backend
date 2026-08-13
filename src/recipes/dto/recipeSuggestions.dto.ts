export class RecipeSuggestions {
  names: string[];

  private constructor(names: string[]) {
    this.names = names;
  }

  static from(names: string[]): RecipeSuggestions {
    return new RecipeSuggestions(names);
  }
}
