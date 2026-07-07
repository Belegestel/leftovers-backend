export class ConfirmPasswordResetResponse {
  message: string;

  static new() {
    return { message: "Password reset successfully" };
  }
}
