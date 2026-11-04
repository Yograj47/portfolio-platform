import { createHash, randomUUID } from 'node:crypto';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const session = await this.usersService.beginSession(user.id);
    const tokens = await this.generateTokens(user.id, session.authVersion);

    const refreshTokenHash = await bcrypt.hash(
      createHash('sha256').update(tokens.refreshToken).digest('hex'),
      10,
    );

    if (
      !(await this.usersService.updateRefreshToken(
        user.id,
        refreshTokenHash,
        session.authVersion,
      ))
    )
      throw new UnauthorizedException('Session has been replaced');

    return tokens;
  }

  async refreshToken(userId: string, refreshToken: string, version: number) {
    const user = await this.usersService
      .findById(userId)
      .catch((error: unknown) => {
        if (error instanceof NotFoundException)
          throw new UnauthorizedException('Access denied');
        throw error;
      });

    if (!user || !user.refreshTokenHash || user.authVersion !== version) {
      throw new UnauthorizedException('Access denied');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      createHash('sha256').update(refreshToken).digest('hex'),
      user.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, version);

    const refreshTokenHash = await bcrypt.hash(
      createHash('sha256').update(tokens.refreshToken).digest('hex'),
      10,
    );

    if (
      !(await this.usersService.rotateRefreshToken(
        user.id,
        user.refreshTokenHash,
        refreshTokenHash,
      ))
    ) {
      throw new UnauthorizedException('Refresh token has already been used');
    }

    return tokens;
  }

  async logout(userId: string, refreshToken: string, version: number) {
    const user = await this.usersService
      .findById(userId)
      .catch((error: unknown) => {
        if (error instanceof NotFoundException)
          throw new UnauthorizedException('Access denied');
        throw error;
      });
    if (
      !user.refreshTokenHash ||
      user.authVersion !== version ||
      !(await bcrypt.compare(
        createHash('sha256').update(refreshToken).digest('hex'),
        user.refreshTokenHash,
      ))
    ) {
      throw new UnauthorizedException('Access denied');
    }
    if (
      !(await this.usersService.rotateRefreshToken(
        user.id,
        user.refreshTokenHash,
        null,
      ))
    ) {
      throw new UnauthorizedException('Refresh token has already been used');
    }

    return {
      message: 'Logged out successfully',
    };
  }

  async generateTokens(userId: string, version: number) {
    const payload = {
      sub: userId,
      version,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('auth.accessSecret'),
      expiresIn: this.configService.getOrThrow('auth.accessExpiresIn'),
    } as JwtSignOptions);

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, jti: randomUUID() },
      {
        secret: this.configService.getOrThrow<string>('auth.refreshSecret'),
        expiresIn: this.configService.getOrThrow<string>(
          'auth.refreshExpiresIn',
        ),
      } as JwtSignOptions,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
