import { ApiProperty } from "@nestjs/swagger";

export class SingleCategory {
  @ApiProperty()
  emoji: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;

  constructor(emoji: string, name: string, id: string) {
    this.emoji = emoji;
    this.name = name;
    this.id = id;
  }
}

export class CategoriesResponse {
  @ApiProperty()
  categories: SingleCategory[];

  private constructor(categories: SingleCategory[]) {
    this.categories = categories;
  }
  static from(categories: SingleCategory[]): CategoriesResponse {
    return new CategoriesResponse(categories);
  }
}
