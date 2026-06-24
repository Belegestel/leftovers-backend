import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import { EmailService } from "./email.service";
import { join } from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
              user: config.get<string>("EMAIL_USER"),
              pass: config.get<string>("EMAIL_PASS"),
            },
          },
          defaults: {
            from: '"No Reply" <no-reply@example.com>',
          },
          template: {
            dir: join(process.cwd(), "src/email/templates"),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
