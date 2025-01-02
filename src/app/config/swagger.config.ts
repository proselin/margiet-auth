import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { undefined } from 'zod';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ISwaggerConfiguration } from './types';

export abstract class SwaggerConfig {
  static setup(app: INestApplication, swaggerConfig: ISwaggerConfiguration) {
    const config = new DocumentBuilder()
      .setTitle('Margiet Auth Documentation')
      .setDescription('API specification for Margiet Auth')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(swaggerConfig.path, app, document);

    app.use(
      swaggerConfig.scalarPath,
      apiReference({
        spec: {
          content: document,
        },
      }),
    )
  }
}
