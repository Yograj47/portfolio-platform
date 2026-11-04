export interface JwtPayload {
  sub: string;
  version: number;
}

export interface RefreshJwtPayload extends JwtPayload {
  refreshToken: string;
}
