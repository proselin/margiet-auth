import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerConfig } from './app/config/swagger.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as fs from 'node:fs';
import path from 'node:path';
import figlet from 'figlet';
import { ISwaggerConfiguration } from './app/config/types';

class App {
  static figlet() {
    const packageJson: Record<string, unknown> = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8')
    );
    console.log(figlet.textSync(<string>packageJson.name, 'Big'));
    console.log(` Version: ${packageJson.version}`);
  }

  public static async main() {
    App.figlet();

    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    const config = app.get<ConfigService>(ConfigService);
    const port = config.get<number>('app.port');
    const host = config.get<string>('app.host');
    const apiPrefix = config.get<string>('app.apiPrefix');
    const swaggerConfig: ISwaggerConfiguration = config.get<ISwaggerConfiguration>("swagger");

    app.setGlobalPrefix(apiPrefix);
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    app.enableShutdownHooks();

    if (swaggerConfig.enable) {
      SwaggerConfig.setup(app, swaggerConfig);
    }

    await app.init();

    await app.listen(port, host, () => {
      Logger.log(`Server is running on http://${host}:${port}`);
      if (swaggerConfig.enable) {
        Logger.log(
          `Swagger is running on http://${host}:${port}${swaggerConfig.path}`
        );
        Logger.log(
          `Scalar is running on http://${host}:${port}${swaggerConfig.scalarPath}`
        );
      } else {
        Logger.warn(`Swagger is disabled`);
      }
      Logger.log(`Api is serving on http://${host}:${port}/${apiPrefix}`);
    });
  }
}

App.main();
