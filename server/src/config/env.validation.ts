import Joi from "joi";

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),


    PORT: Joi.number().port().default(3000),

    API_PREFIX: Joi.string().default('api'),

    DATABASE_URL: Joi.string().uri().required(),

    // JWT
    JWT_ACCESS_SECRET: Joi.string().min(32).required(),

    JWT_REFRESH_SECRET: Joi.string().min(32).required(),

    JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),

    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

    // Swagger
    SWAGGER_TITLE: Joi.string().default('Portfolio API'),

    SWAGGER_DESCRIPTION: Joi.string().default(
        'Portfolio Platform REST API',
    ),

    SWAGGER_VERSION: Joi.string().default('1.0.0'),

    SWAGGER_PATH: Joi.string().default('docs'),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: Joi.string().allow('').optional(),

    CLOUDINARY_API_KEY: Joi.string().allow('').optional(),

    CLOUDINARY_API_SECRET: Joi.string().allow('').optional(),
})