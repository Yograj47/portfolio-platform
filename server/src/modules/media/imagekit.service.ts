import { Injectable } from '@nestjs/common';
import ImageKit from '@imagekit/nodejs';

@Injectable()
export class ImageKitService {
  private readonly client: ImageKit;

  constructor() {
    this.client = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    });
  }

  getAuthenticationParameters() {
    return this.client.helper.getAuthenticationParameters();
  }

  async deleteFile(publicId: string) {
    return this.client.files.delete(publicId, {
      timeout: 12000,
      maxRetries: 0,
    });
  }

  async getFile(publicId: string) {
    return this.client.files.get(publicId, { timeout: 10000, maxRetries: 0 });
  }
}
