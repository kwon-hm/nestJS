import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    const { method, originalUrl, headers } = req;
    const timestamp = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss.SSS')
    const url = req.url
    const logContext = {
      ip,
      method,
      url,
      timestamp
    };

    req['logContext'] = logContext;

    res.on('finish', () => {
        const { statusCode } = res;
        // this.logger.log(
        //   `Request finish. ${url} ${method} ${originalUrl} ${statusCode} ${ip} ${userAgent}`,
        //   {req}
        // );
        console.log(
          `${timestamp} Request finish . ${url} ${method} ${originalUrl} ${statusCode} ${ip} ${userAgent}`
        );
      });

    next();
  }
}