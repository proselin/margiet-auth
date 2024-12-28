import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export abstract class SwaggerConfig {
  static setup(app: INestApplication, swaggerPath: string) {
    const config = new DocumentBuilder()
      .setTitle('Margiet Auth Documentation')
      .setDescription('API specification for Margiet Auth')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document);
  }
}
