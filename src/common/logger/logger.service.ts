import {
  Injectable,
  Scope,
  LoggerService as NestLoggerService,
  Inject,
} from '@nestjs/common';
import { Logger } from 'winston';
import { RequestContext } from '../types/context.type';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService implements NestLoggerService {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  /**
   * Log an info message.
   * @param message - Log message
   * @param context - Request context
   */
  log(message: string, context?: RequestContext): void {
    try {
      const logContext = context?.req?.logContext;
      const prefix = logContext
        ? `${logContext.timestamp} ${logContext.url} ${logContext.ip}`
        : '';
      const logMessage = prefix ? `${prefix}\n${message}` : message;
      this.logger.info(logMessage);
    } catch (err) {
      console.error(`LoggerService log error: ${err}`);
    }
  }

  /**
   * Log an error message.
   * @param message - Error message
   * @param context - Request context
   * @param trace - Stack trace
   */
  error(message: string, context?: RequestContext, trace?: string): void {
    try {
      const logContext = context?.req?.logContext;
      const prefix = logContext
        ? `${logContext.timestamp} ${logContext.url} ${logContext.ip}`
        : '';
      const traceMessage = trace ? `\nTrace: ${trace}` : '';
      const logMessage = prefix
        ? `${prefix}\n${message}${traceMessage}`
        : `${message}${traceMessage}`;
      this.logger.error(logMessage);
    } catch (err) {
      console.error(`LoggerService error logging failed: ${err}`);
    }
  }

  /**
   * Log a warning message.
   * @param message - Warning message
   * @param context - Request context
   */
  warn(message: string, context?: RequestContext): void {
    try {
      const logContext = context?.req?.logContext;
      const prefix = logContext
        ? `${logContext.timestamp} ${logContext.url} ${logContext.ip}`
        : '';
      const logMessage = prefix ? `${prefix}\n${message}` : message;
      this.logger.warn(logMessage);
    } catch (err) {
      console.error(`LoggerService warn error: ${err}`);
    }
  }

  /**
   * Log a debug message.
   * @param message - Debug message
   * @param context - Request context
   */
  debug(message: string, context?: RequestContext): void {
    try {
      const logContext = context?.req?.logContext;
      const prefix = logContext
        ? `${logContext.timestamp} ${logContext.url} ${logContext.ip}`
        : '';
      const logMessage = prefix ? `${prefix}\n${message}` : message;
      this.logger.debug(logMessage);
    } catch (err) {
      console.error(`LoggerService debug error: ${err}`);
    }
  }

  /**
   * Log a verbose message.
   * @param message - Verbose message
   * @param context - Request context
   */
  verbose(message: string, context?: RequestContext): void {
    try {
      const logMessage = context
        ? `${message} ${JSON.stringify(context)}`.trim()
        : message;
      this.logger.verbose(logMessage);
    } catch (err) {
      console.error(`LoggerService verbose error: ${err}`);
    }
  }
}
