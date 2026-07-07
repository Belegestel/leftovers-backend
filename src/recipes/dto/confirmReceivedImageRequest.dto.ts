import { IsString } from "class-validator";

export class ConfirmReceivedImageRequest {
  @IsString()
  key: string;
}
