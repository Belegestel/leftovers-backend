export const mockPasswordResetRepository = {
  create: jest.fn(),
  findValidByTokenHash: jest.fn(),
  markAsUsed: jest.fn(),
};
