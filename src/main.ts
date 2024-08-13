import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger as NestLogger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserModule } from './user/user.module';
const port = process.env.port || 3000

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });
    app.useGlobalPipes(
        // new ValidationPipe({
            // whitelist: true, // null이거나 정의되지 않은 모든 속성의 유효성 검사를 건너뜀
            // forbidNonWhitelisted: true, // 허용 목록에 없는 속성을 제거하는 대신 유효성 검사기가 예외를 발생
            // transform: true, // DTO 클래스에 따라 지정된 유형 객체로 자동 변환
        // })
    )
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    const options = new DocumentBuilder()
        .setTitle('Your API Title')
        .setDescription('Your API description')
        .setVersion('1.0')
        .addServer(`http://localhost:${port}/`, 'Local environment')
        .addServer('https://staging.yourapi.com/', 'Staging')
        .addServer('https://production.yourapi.com/', 'Production')
        .addTag('Your API Tag')
        .build();

    const catDocument = SwaggerModule.createDocument(app, options, {
        include: [UserModule],
        });
    SwaggerModule.setup('api-docs/uses', app, catDocument);

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  
    await app.listen(port);

}

void (async (): Promise<void> => {
    try {
      const url = await bootstrap();
      NestLogger.log(url, '🚀🚀🚀 Nest application successfully started.');
    } catch (error) {
      NestLogger.error(error, 'Nest application error');
    }
})();