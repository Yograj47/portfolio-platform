export interface JwtPayload {
    sub: string;
}

export interface RefreshJwtPayload extends JwtPayload {
    refreshToken: string;
}