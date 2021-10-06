/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cache from '@queimadiaria/backend-cache-lib';
import * as fs from 'fs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as newrelic from 'newrelic';
import { HttpExceptionFilter } from './api/filters/http-exception.filter';
import { AppModule } from './app.module';

const API_TITLE = 'microservice-x';
const API_DESCRIPTION = 'Describe your microservice-x'
const API_TAG = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: ['log', 'error', 'warn', 'debug'],
  });
  app.enableCors();
  // propositalmente feito para que o TypeScript detecte o newrelic, pois se 
  // um import não for utilizado pelo menos uma vez, em tempo de compilação
  // o pacote é ignorado e assim não monitoramos a aplicação.
  const nrlc = newrelic;
  await cache.cacheClient({
    environment: process.env.NODE_ENV,
  });

  const config = new DocumentBuilder()
    .setTitle(API_TITLE)
    .setDescription(API_DESCRIPTION)
    .setVersion('1.0')
    .addTag(API_TAG)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },'authorization')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
