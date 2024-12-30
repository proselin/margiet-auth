import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerConfig } from './app/config/swagger.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as fs from 'node:fs';
import path from 'node:path';
import figlet from 'figlet';

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
    const swaggerPath = config.get<string>('swagger.path');
    const swaggerEnable = config.get<boolean>('swagger.enable');

    app.setGlobalPrefix(apiPrefix);
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    app.enableShutdownHooks();

    if (swaggerEnable) {
      SwaggerConfig.setup(app, swaggerPath);
    }

    await app.init();

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
