import { PasswordResetRequest } from "./request/passwordResetRequest.dto";

export class CreatePasswordReset {
  email: string;

  private constructor(email: string) { this.email = email;}

  static from(dto: PasswordResetRequest): CreatePasswordReset {
    return new CreatePasswordReset(dto.email)
  }
}
