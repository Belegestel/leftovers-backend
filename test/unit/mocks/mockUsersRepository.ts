export const mockUsersRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  updatePassword: jest.fn(),
  storeRefreshToken: jest.fn(),
  getRefreshToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
};
