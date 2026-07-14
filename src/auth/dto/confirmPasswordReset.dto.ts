import { ConfirmPasswordResetRequest } from "./request/confirmPasswordResetRequest.dto";

export class ConfirmPasswordReset {
  token: string;
  newPassword: string;

  private constructor(token: string, newPassword: string) {
    this.token = token;
    this.newPassword = newPassword;
  }

  static from(dto: ConfirmPasswordResetRequest): ConfirmPasswordReset {
    return new ConfirmPasswordReset(dto.token, dto.newPassword);
  }
}
