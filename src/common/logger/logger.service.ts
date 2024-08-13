import { Injectable, Scope, LoggerService as NestLoggerService, Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService implements NestLoggerService {
  constructor(
    @Inject('winston') private readonly logger: Logger
  ) {}

  log(message: string, context?: any) {
    try {
        const logMessage = `${context?.req?.logContext?.timestamp} ${context?.req?.logContext?.url} ${context?.req?.logContext?.ip}
        ${message}`;
        this.logger.info(logMessage);
    } catch (err) {
        throw new Error(`LoggerService log ${err}`)
    }
  }

  error(message: string, context?: any, trace?: string, ) {
    try {
        const logMessage = `${context?.req?.logContext?.timestamp} ${context?.req?.logContext?.url} ${context?.req?.logContext?.ip}
        ${message} ${trace ? `\nTrace: ${trace}` : ''}`;
        this.logger.error(logMessage);
    } catch (err) {
        throw new Error(`LoggerService error ${err}`)
    }
  }

  warn(message: string, context?: any) {
    try {
        const logMessage = `${context?.req?.logContext?.timestamp} ${context?.req?.logContext?.url} ${context?.req?.logContext?.ip}
        ${message}`;
        this.logger.warn(logMessage);
    } catch (err) {
        throw new Error(`LoggerService warn ${err}`)
    }
  }

  debug(message: string, context?: any) {
    try {
        const logMessage = `${context?.req?.logContext?.timestamp} ${context?.req?.logContext?.url} ${context?.req?.logContext?.ip}
        ${message}`;
        this.logger.debug(logMessage);
    } catch (err) {
        throw new Error(`LoggerService debug ${err}`)       
    }
  }

  verbose(message: string, context?: any) {
    try {
        const logMessage = `${message} ${context ? JSON.stringify(context) : ''}`.trim();
        this.logger.verbose(logMessage);
    } catch (err) {
        throw new Error(`LoggerService verbose ${err}`)       
    }
  }
}