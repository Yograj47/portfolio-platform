import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    name: process.env.APP_NAME,
    env: process.env.NODE_ENV,
    url: process.env.APP_URL,
    port: Number(process.env.PORT),
    apiPrefix: process.env.API_PREFIX,
    clientUrl: process.env.CLIENT_URL
}));