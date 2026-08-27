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

}