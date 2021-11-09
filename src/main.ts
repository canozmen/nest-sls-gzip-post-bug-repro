import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { Callback, Context, Handler } from 'aws-lambda';
import { HttpStatus } from '@nestjs/common';

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const appService = appContext.get(AppService);

  let jsonBody = { status: HttpStatus.OK };
  if (event.body !== null && event.body !== undefined) {
    jsonBody = JSON.parse(event.body);
  }

  return {
    body: appService.getHello() + ' ' + JSON.stringify(jsonBody),
    statusCode: HttpStatus.OK,
  };
};