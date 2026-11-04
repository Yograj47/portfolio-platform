import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().port().default(3001),

  API_PREFIX: Joi.string().default('api'),

  DATABASE_URL: Joi.string().uri().required(),

  CLIENT_URL: Joi.string().uri().required(),

  // JWT
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),

  JWT_REFRESH_SECRET: Joi.string()
    .min(32)
    .invalid(Joi.ref('JWT_ACCESS_SECRET'))
    .required(),

  JWT_ACCESS_EXPIRES_IN: Joi.string()
    .pattern(/^[1-9][0-9]*(s|m|h|d|w)$/)
    .default('15m'),

  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .pattern(/^[1-9][0-9]*(s|m|h|d|w)$/)
    .default('7d'),

  // Swagger
  SWAGGER_TITLE: Joi.string().default('Portfolio API'),

  SWAGGER_DESCRIPTION: Joi.string().default('Portfolio Platform REST API'),

  SWAGGER_VERSION: Joi.string().default('1.0.0'),

  SWAGGER_PATH: Joi.string().default('docs'),

  TRUST_PROXY_HOPS: Joi.number().integer().min(0).max(5).default(0),
  COOKIE_SAME_SITE: Joi.string()
    .valid('strict', 'lax', 'none')
    .default('strict'),
  CV_ALLOWED_HOSTS: Joi.string().allow('').default(''),
  IMAGEKIT_PRIVATE_KEY: Joi.string().required(),
});
