import { Injectable, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    context
      .switchToHttp()
      .getResponse<Response>()
      .setHeader('Cache-Control', 'private, no-store');
    return (await super.canActivate(context)) as boolean;
  }
}
