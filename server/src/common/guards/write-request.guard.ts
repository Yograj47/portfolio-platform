import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma/prisma.service';
import { createHash } from 'node:crypto';
import type { Request, Response } from 'express';

@Injectable()
export class WriteRequestGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const routePath = request.path.toLowerCase().replace(/\/+$/, '');
    const isCv = /\/users\/resume\/?$/.test(routePath);
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method) && !isCv)
      return true;
    const origin = request.get('origin');
    if (
      (origin &&
        origin !==
          new URL(this.config.getOrThrow<string>('app.clientUrl')).origin) ||
      ((request.cookies as Record<string, unknown> | undefined)?.refreshToken &&
        !origin &&
        routePath.includes('/auth/'))
    ) {
      throw new ForbiddenException('Request origin is not allowed');
    }
    const isMessage =
      request.method === 'POST' && /\/messages\/?$/.test(routePath);
    const isAuth = /\/auth\/(login|refresh|logout)\/?$/.test(routePath);
    if (!isMessage && !isAuth && !isCv) return true;
    const seconds = isMessage ? 600 : 60;
    const limit = isMessage ? 5 : isCv ? 30 : 15;
    const now = Date.now();
    const window = Math.floor(now / (seconds * 1000));
    const expiresAt = new Date((window + 1) * seconds * 1000);
    const key = createHash('sha256')
      .update((request.ip ?? 'unknown') + ':' + routePath + ':' + window)
      .digest('hex');
    const entry = await this.prisma.apiRateLimit.upsert({
      where: { key },
      create: { key, expiresAt },
      update: { count: { increment: 1 } },
    });
    await this.prisma.apiRateLimit.deleteMany({
      where: { expiresAt: { lt: new Date(now - 3600000) } },
    });
    if (entry.count > limit) {
      response.setHeader(
        'Retry-After',
        Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)),
      );
      throw new HttpException(
        'Too many requests. Please try again later.',
        429,
      );
    }
    return true;
  }
}
