import { Test, TestingModule } from "@nestjs/testing";
import { MailerService } from "@nestjs-modules/mailer";
import { EmailService } from "./email.service";

describe("EmailService", () => {
  let service: EmailService;

  const mailerMock = {
    sendMail: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: MailerService, useValue: mailerMock },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should send email", async () => {
    await service.sendEmail(
      "test@test.com",
      "Test",
      "example",
      { name: "John", email: "test@test.com" },
    );

    expect(mailerMock.sendMail).toHaveBeenCalled();
  });
});
