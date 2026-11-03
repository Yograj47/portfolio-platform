import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { CookieOptions } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { RefreshJwtPayload } from '@/common/interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  private cookieOptions(token?: string): CookieOptions {
    const sameSite = this.config.get<'strict' | 'lax' | 'none'>(
      'COOKIE_SAME_SITE',
      'strict',
    );
    return {
      httpOnly: true,
      secure:
        this.config.get('NODE_ENV') === 'production' || sameSite === 'none',
      sameSite,
      path: '/',
      ...(token
        ? {
            maxAge: Math.max(
              0,
              this.jwt.decode<{ exp: number }>(token).exp * 1000 - Date.now(),
            ),
          }
        : {}),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successful')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(dto);

    response.cookie(
      'refreshToken',
      tokens.refreshToken,
      this.cookieOptions(tokens.refreshToken),
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Token refreshed successfully')
  async refresh(
    @CurrentUser() user: RefreshJwtPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.refreshToken(
      user.sub,
      user.refreshToken,
    );

    response.cookie(
      'refreshToken',
      tokens.refreshToken,
      this.cookieOptions(tokens.refreshToken),
    );

    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Logged out successfully')
  async logout(
    @CurrentUser() user: RefreshJwtPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user.sub, user.refreshToken);

    response.clearCookie('refreshToken', this.cookieOptions());

    return null;
  }
}
