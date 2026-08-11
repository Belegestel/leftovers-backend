import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { RecipesModule } from "./recipes/recipes.module";
import { FilesModule } from "./files/files.module";
import { CacheModule } from "@nestjs/cache-manager";
import { NotificationsModule } from './notifications/notifications.module';
import KeyvRedis from "@keyv/redis";

const THREE_MINUTES = 3 * 60 * 1000;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "test" ? "test.env" : ".env",
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        stores: [new KeyvRedis(config.getOrThrow<string>("REDIS_URL"))],
        ttl: THREE_MINUTES,
      }),
    }),
    UsersModule,
    AuthModule,
    EmailModule,
    RecipesModule,
    FilesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
