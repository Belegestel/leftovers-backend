export class PresignedUrlResult {
  url: string;
  key: string;

  private constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  static from(url: string, key: string): PresignedUrlResult {
    return new PresignedUrlResult(url, key);
  }
}
