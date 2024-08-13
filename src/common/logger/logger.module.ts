import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './logger.config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerService } from "./logger.service";
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [
    WinstonModule.forRoot(winstonLogger)
  ],
  providers: [
    LoggerService,
  ],
  exports: [
    LoggerService,
  ],
})

export class LoggerModule implements NestModule{
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('*');
      }
}