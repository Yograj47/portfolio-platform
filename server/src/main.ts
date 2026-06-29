import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(configService.getOrThrow<string>('swagger.title'))
    .setDescription(configService.getOrThrow<string>('swagger.description'))
    .setVersion(configService.getOrThrow<string>('swagger.version'))
    .addServer(`/${configService.getOrThrow<string>('app.apiPrefix')}`)
    .build();

  const docsPath = configService.getOrThrow<string>('swagger.path');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsPath, app, document, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  })


  const port = configService.getOrThrow<number>('app.port');
  const apiPrefix = configService.getOrThrow<string>('app.apiPrefix');

  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);


  console.log(
    `🚀 API: http://localhost:${port}/${apiPrefix}`,
  );

  console.log(
    `📄 Swagger: http://localhost:${port}/${docsPath}`,
  );

}
bootstrap();
