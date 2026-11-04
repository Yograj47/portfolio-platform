import { UsersService } from '../../users/users.service';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly users: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_ACCESS_SECRET ||
        configService.getOrThrow<string>('auth.accessSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    if (
      !payload.sub ||
      typeof payload.sub !== 'string' ||
      !Number.isInteger(payload.version) ||
      payload.version < 0
    )
      throw new UnauthorizedException('Invalid token');
    const user = await this.users
      .findById(payload.sub)
      .catch((error: unknown) => {
        if (error instanceof NotFoundException)
          throw new UnauthorizedException('Account no longer exists');
        throw error;
      });
    if (user.authVersion !== payload.version)
      throw new UnauthorizedException('Session is no longer active');
    return payload;
  }
}
