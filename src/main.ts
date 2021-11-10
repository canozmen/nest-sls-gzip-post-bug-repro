import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

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

  event.body = (Buffer.from(event.body, 'binary') as unknown) as string;
  
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};