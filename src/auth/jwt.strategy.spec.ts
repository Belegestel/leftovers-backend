import { JwtStrategy } from "./jwt.strategy";
import { ConfigService } from "@nestjs/config";

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    const configService = {
      get: jest.fn().mockReturnValue("test-secret"),
    } as any as ConfigService;

    strategy = new JwtStrategy(configService);
  });

  it("should validate and transform payload correctly", async () => {
    const payload = {
      sub: "user",
      email: "test@example.com",
    };
    const result = await strategy.validate(payload);

    expect(result).toEqual({
      userId: "user",
      email: "test@example.com",
    });
  });
});
