import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { RecipesModule } from "./recipes/recipes.module";
import { FilesModule } from "./files/files.module";
import { CacheModule } from "@nestjs/cache-manager";
import KeyvRedis from "@keyv/redis";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "test" ? "test.env" : ".env",
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        stores: [new KeyvRedis("redis://localhost:6379")],
        ttl: 3 * 60 * 1000,
      }),
    }),
    UsersModule,
    AuthModule,
    EmailModule,
    RecipesModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
