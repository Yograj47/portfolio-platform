import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
    title: process.env.SWAGGER_TITLE,
    description: process.env.SWAGGER_DESCRIPTION,
    version: process.env.SWAGGER_VERSION,
    path: process.env.SWAGGER_PATH,
}));