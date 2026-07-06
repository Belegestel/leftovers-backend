import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { ConfigService } from "@nestjs/config";
import { SignupRequestsRepository } from "./signup-requests.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { EmailModule } from "../email/email.module";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { PasswordResetRepository } from "./password-reset.repository";

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    EmailModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_SECRET"),
        signOptions: { expiresIn: "24h" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SignupRequestsRepository, JwtStrategy, PasswordResetRepository],
})
export class AuthModule {}
