import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger as NestLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Validation Pipe 활성화
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // 허용되지 않은 속성이 있으면 에러 발생
      transform: true, // 자동 타입 변환
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Winston Logger 사용
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // ConfigService로 환경 변수 가져오기
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const nodeEnv = configService.get('NODE_ENV') || 'development';

  // Swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS GraphQL API')
    .setDescription('User and Department Management API')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}/`, 'Local environment')
    .addTag('Users')
    .addTag('Departments')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);

  NestLogger.log(
    `🚀 Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  NestLogger.log(
    `📚 API Documentation: http://localhost:${port}/api-docs`,
    'Bootstrap',
  );
  NestLogger.log(
    `🔍 GraphQL Playground: http://localhost:${port}/graphql`,
    'Bootstrap',
  );
  NestLogger.log(`🌍 Environment: ${nodeEnv}`, 'Bootstrap');
}

void (async (): Promise<void> => {
  try {
    await bootstrap();
  } catch (error) {
    NestLogger.error('❌ Application failed to start', error);
    process.exit(1);
  }
})();
