import { Logger, createLogger, format, transports } from 'winston';

export class AppLogger {
  private context?: string;
  private logger: Logger;

  public setContext(context: string): void {
    this.context = context;
  }

  constructor() {
    this.logger = createLogger({
      level: process.env.LOGGER_LEVEL,
      format: format.combine(format.timestamp(), format.prettyPrint()),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  error(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.error({
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }

  warn(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.warn({
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }

  debug(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.debug({
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }

  info(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.info({
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }
}
