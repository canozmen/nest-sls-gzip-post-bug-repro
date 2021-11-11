import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { AppService } from './app.service';
import { HttpStatus } from '@nestjs/common';

let server: Handler;

async function bootstrap() : Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  // Change body depending on Content-Type, because gzipped body is not working with default serialization
  // Code taken from https://github.com/vendia/serverless-express/issues/251
  console.log(JSON.stringify(event.headers));
  console.log(JSON.stringify(context));

  if (event.path === "/scada") {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const appService = appContext.get(AppService);
    let jsonBody = [];
    if (event.body !== null && event.body !== undefined) {
      console.log(event.body);
      jsonBody = event.body;
    }
    return {
      body: appService.postScada("scada", jsonBody),
      statusCode: HttpStatus.OK,
    };
  }

  //event.body = (Buffer.from(event.body, 'binary') as unknown) as string;
  if (event.headers['Content-Encoding'] === 'gzip') {
    //event.body = Buffer.from(event.body, 'binary');
  }
  
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};