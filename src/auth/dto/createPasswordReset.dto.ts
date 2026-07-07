import { PasswordResetRequest } from "./request/passwordResetRequest.dto";

export class CreatePasswordReset {
  email: string;

  static from(dto: PasswordResetRequest) {
    return {
      email: dto.email
    }
  }
}
