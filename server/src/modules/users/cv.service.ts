import type { ReadableStreamDefaultReader } from 'node:stream/web';
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
@Injectable()
export class CvService {
  constructor(
    private readonly users: UsersService,
    private readonly config: ConfigService,
  ) {}
  async file(download = false) {
    const profile = await this.users.getPublicProfile();
    if (!profile.resumeUrl) throw new NotFoundException('CV is not available');
    const allowed = this.config
      .get<string>('CV_ALLOWED_HOSTS', '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    const url = new URL(profile.resumeUrl);
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      (url.port && url.port !== '443') ||
      !allowed.includes(url.hostname.toLowerCase())
    ) {
      throw new ServiceUnavailableException('CV host is not configured');
    }
    try {
      const result = await fetch(url, {
        redirect: 'error',
        signal: AbortSignal.timeout(10000),
      });
      if (!result.ok || !result.body) throw new Error('CV unavailable');
      const maxBytes = 10 * 1024 * 1024;
      if (Number(result.headers.get('content-length')) > maxBytes) {
        await result.body.cancel();
        throw new Error('CV too large');
      }
      const reader =
        result.body.getReader() as ReadableStreamDefaultReader<Uint8Array>;
      const chunks: Uint8Array[] = [];
      let size = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > maxBytes) throw new Error('CV too large');
          chunks.push(value);
        }
      } finally {
        await reader.cancel();
      }
      const file = Buffer.concat(chunks);
      if (file.subarray(0, 5).toString() !== '%PDF-')
        throw new Error('Invalid PDF');
      return new StreamableFile(file, {
        type: 'application/pdf',
        disposition:
          (download ? 'attachment' : 'inline') +
          '; filename="Yograj-Rijal-CV.pdf"',
        length: file.length,
      });
    } catch {
      throw new BadGatewayException(
        'CV could not be loaded. Please try again later.',
      );
    }
  }
}
