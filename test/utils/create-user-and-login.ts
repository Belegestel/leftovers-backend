import { INestApplication } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import request from "supertest";

export async function createUserAndLogin(
  app: INestApplication,
  prisma: PrismaService,
  email: string,
  password: string,
) {
  await request(app.getHttpServer())
    .post("/auth/register")
    .send({ email, password, name: "test name" })
    .expect(200);

  const signupRequest = await prisma.signup_requests.findUnique({
    where: { email },
  });

  await request(app.getHttpServer())
    .post("/auth/confirm-registration")
    .send({ email, token: signupRequest!.token })
    .expect(201);

  const loginReponse = await request(app.getHttpServer())
    .post("/auth/login")
    .send({ email, password })
    .expect(200);
  const user = await prisma.users.findUnique({ where: { email } });


  return { user: user!, token: loginReponse.body.accessToken };
}
