import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { ResponseMessage } from "@/common/decorators/response-message.decorator";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import type { JwtPayload, RefreshJwtPayload } from "@/common/interfaces/jwt-payload.interface";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService) { }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Login successful")
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const tokens = await this.authService.login(dto);

        response.cookie(
            "refreshToken",
            tokens.refreshToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }
        );

        return {
            accesToken: tokens.accessToken,
        }
    }

    @Post("refresh")
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Token refreshed successfully")
    async refresh(
        @CurrentUser() user: RefreshJwtPayload,
        @Res({ passthrough: true }) response: Response
    ) {
        const tokens = await this.authService.refreshToken(
            user.sub,
            user.refreshToken
        );

        response.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken: tokens.accessToken
        }
    }

    @Post("logout")
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Logged out successfully")
    async logout(
        @CurrentUser() user: JwtPayload,
        @Res({ passthrough: true }) response: Response
    ) {
        await this.authService.logout(user.sub);

        response.clearCookie("refreshToken");

        return null;
    }

}
