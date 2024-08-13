import * as path from "path";
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import winstonDaily from 'winston-daily-rotate-file';
import moment from 'moment-timezone';

const logDir = path.join(__dirname, '../../../logs');

const timestampFormat = () => {
    return moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss.SSS'); // Adjust to UTC+9 (Seoul)
  };
  
const dailyOptions = (level: string) => {
    return {
      level,
      datePattern: 'YYYY-MM-DD',
      dirname: path.join(logDir, level),
      filename: `%DATE%.${level}.log`,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '1d',
    };
  };
  
export const winstonLogger = {
    transports: [
      new winston.transports.Console({
        level: true ? 'info' : 'silly',
        format: false
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp({ format: timestampFormat }),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('MyApp', {
                colors: true,
                prettyPrint: true,
              }),
            // winston.format.colorize(),
            // winston.format.timestamp({ format: timestampFormat }),
            // winston.format.printf(({ level, message, timestamp }) => {
            //   return `${timestamp} [${level}] - ${message}`;
            // }),
            ),
      }),
      new winstonDaily(dailyOptions('info')),
      new winstonDaily(dailyOptions('warn')),
      new winstonDaily(dailyOptions('error')),
    ],
    // format: winston.format.combine(
    //   winston.format.errors({ stack: true }),
    //   winston.format.splat(),
    //   winston.format.json(),
    // ),
  };