import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService, JwtSignOptions } from "@nestjs/jwt"
import { ConfigService } from '@nestjs/config';
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException("Invalid credentails");
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentails")
        }

        const tokens = await this.generateTokens(user.id);

        const refreshTokenHash = await bcrypt.hash(
            tokens.refreshToken,
            10
        );

        await this.usersService.updateRefreshToken(
            user.id,
            refreshTokenHash
        );

        return tokens;
    }

    async refreshToken(userId: string, refreshToken: string) {
        const user = await this.usersService.findById(userId);

        if (!user || !user.refreshTokenHash) {
            throw new UnauthorizedException("Access denied");
        }

        const isRefreshTokenValid = await bcrypt.compare(
            refreshToken,
            user.refreshTokenHash
        );

        if (!isRefreshTokenValid) {
            throw new UnauthorizedException("Access denied");
        }

        const tokens = await this.generateTokens(user.id);

        const refreshTokenHash = await bcrypt.hash(
            tokens.refreshToken,
            10
        );

        await this.usersService.updateRefreshToken(
            user.id,
            refreshTokenHash,
        );

        return tokens;
    }

    async logout(userId: string) {
        await this.usersService.updateRefreshToken(userId, null);

        return {
            message: "Logged out successfully",
        };
    }

    async generateTokens(userId: string) {
        const payload = {
            sub: userId,
        }

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow("auth.accessSecret"),
            expiresIn: this.configService.getOrThrow("auth.accessExpiresIn"),
        } as JwtSignOptions);

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow<string>("auth.refreshSecret"),
            expiresIn: this.configService.getOrThrow<string>("auth.refreshExpiresIn"),
        } as JwtSignOptions);

        return {
            accessToken,
            refreshToken
        }
    }

}
