import { registerAs } from "@nestjs/config";

export default registerAs('App', () => ({
    name: process.env.APP_NAME,
    env: process.env.NODE_ENV,
    url: process.env.APP_URL,
    port: Number(process.env.PORT),
    apiPrefix: process.env.API_PREFIX,
}));