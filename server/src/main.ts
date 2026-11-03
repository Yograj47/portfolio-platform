import type { Express } from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(cookieParser());
  const trustProxy = process.env.TRUST_PROXY_HOPS
    ? Number(process.env.TRUST_PROXY_HOPS)
    : 0;
  (app.getHttpAdapter().getInstance() as Express).set(
    'trust proxy',
    trustProxy,
  );
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [configService.getOrThrow<string>('app.clientUrl')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle(configService.getOrThrow<string>('swagger.title'))
      .setDescription(configService.getOrThrow<string>('swagger.description'))
      .setVersion(configService.getOrThrow<string>('swagger.version'))
      .addServer(`/${configService.getOrThrow<string>('app.apiPrefix')}`)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'access-token',
      )
      .build();

    const docsPath = configService.getOrThrow<string>('swagger.path');

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(docsPath, app, document);
  }

  const port = configService.getOrThrow<number>('app.port');
  const apiPrefix = configService.getOrThrow<string>('app.apiPrefix');

  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);

  console.log(`🚀 API: http://localhost:${port}/${apiPrefix}`);

  console.log(`Swagger is available in development`);
}
void bootstrap();
