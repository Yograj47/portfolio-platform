import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Request } from "express";
import { JwtPayload } from "@/common/interfaces/jwt-payload.interface";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.refreshToken,
            ]),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.getOrThrow<string>("auth.refreshSecret")
        });
    }

    async validate(
        request: Request,
        payload: JwtPayload) {
        const refreshToken = request.cookies?.refreshToken;
        return {
            ...payload,
            refreshToken
        }
    }
}