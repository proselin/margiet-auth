import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerConfig } from './app/config/swagger.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

class App {
  public static async main() {
    const app = await NestFactory.create(AppModule);

    const config = app.get<ConfigService>(ConfigService);
    const port = config.get<number>('app.port');
    const host = config.get<string>('app.host');
    const apiPrefix = config.get<string>('app.apiPrefix');
    const swaggerPath = config.get<string>('swagger.path');
    const swaggerEnable = config.get<boolean>('swagger.enable');

    app.setGlobalPrefix(apiPrefix);
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true })
    );
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    if (swaggerEnable) {
      SwaggerConfig.setup(app, swaggerPath);
    }

    await app.listen(port, host, () => {
      Logger.log(`Server is running on http://${host}:${port}`);
      if (swaggerEnable) {
        Logger.log(
          `Swagger is running on http://${host}:${port}${swaggerPath}`
        );
      } else {
        Logger.warn(`Swagger is disabled`);
      }
      Logger.log(`Api is serving on http://${host}:${port}/${apiPrefix}`);
    });
  }
}

App.main();
