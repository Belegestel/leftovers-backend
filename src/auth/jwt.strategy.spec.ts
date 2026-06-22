import { Test } from "@nestjs/testing";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule } from "@nestjs/config";

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [JwtStrategy],
    }).compile();
    strategy = moduleRef.get(JwtStrategy);
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
