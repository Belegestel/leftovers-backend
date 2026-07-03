export class PresignedUrlResult {
  url: string;
  key: string;

  static from(url: string, key: string): PresignedUrlResult {
    return { url, key };
  }
}
