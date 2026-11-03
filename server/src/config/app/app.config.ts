import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  env: process.env.NODE_ENV,
  url: process.env.APP_URL,
  port: Number(process.env.PORT || 3001),
  apiPrefix: process.env.API_PREFIX,
  clientUrl: process.env.CLIENT_URL
    ? new URL(process.env.CLIENT_URL).origin
    : undefined,
}));
