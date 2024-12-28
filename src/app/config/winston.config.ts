import winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { NodeEnv } from '../common/enums';

export abstract class WinstonConfig {
  static register() {
    return WinstonModule.forRootAsync({
      useFactory: () => {
        if (process.env.NODE_ENV === NodeEnv.Production) {
          return this.registerProduction();
        }
        return this.registerDevelopment();
      },
    });
  }

  static registerDevelopment() {
    return {
      transports: [
        new winston.transports.Console({
          debugStdout: true,
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('Margiet Auth', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            })
          ),
        }),
      ],
    };
  }

  static registerProduction() {
    return {
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.ms(),
            winston.format.metadata()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
      ],
      exceptionHandlers: [
        new winston.transports.File({
          filename: `logs/exceptions.log`,
        }),
      ],
      rejectionHandlers: [
        new winston.transports.File({
          filename: `logs/rejections.log`,
        }),
      ],
    } satisfies winston.LoggerOptions;
  }
}
