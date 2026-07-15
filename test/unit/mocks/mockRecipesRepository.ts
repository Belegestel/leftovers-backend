export const mockRecipesRepository = {
  findAll: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  rateRecipe: jest.fn(),
  bookmarkRecipe: jest.fn(),
  unbookmarkRecipe: jest.fn(),
};
