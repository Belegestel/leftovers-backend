import { ConfirmPasswordResetRequest } from "./request/confirmPasswordResetRequest.dto";

export class ConfirmPasswordReset {
  token: string;
  newPassword: string;

  static from(dto: ConfirmPasswordResetRequest): ConfirmPasswordReset {
    return {
      token: dto.token,
      newPassword: dto.newPassword,
    };
  }
}
