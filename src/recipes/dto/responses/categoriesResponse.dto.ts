import { ApiProperty } from "@nestjs/swagger";

export class CategoriesResponse {
  @ApiProperty()
  categories: string[];

  private constructor(categories: string[]) {
    this.categories = categories;
  }
  static from(categories: string[]): CategoriesResponse {
    return new CategoriesResponse(categories);
  }
}
