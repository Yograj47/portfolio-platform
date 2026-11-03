import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

function readCookie(request: Request): string | null {
  const token = (request.cookies as Record<string, unknown> | undefined)
    ?.refreshToken;
  return typeof token === 'string' ? token : null;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => readCookie(request),
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey:
        process.env.JWT_REFRESH_SECRET ||
        configService.getOrThrow<string>('auth.refreshSecret'),
    });
  }

  validate(request: Request, payload: JwtPayload) {
    const refreshToken = readCookie(request);
    if (!refreshToken || typeof payload.sub !== 'string' || !payload.sub)
      throw new UnauthorizedException('Invalid refresh token');
    return {
      ...payload,
      refreshToken,
    };
  }
}
