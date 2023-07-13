import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import {ValidationPipe} from "@nestjs/common";
import {logger3} from "./logger3/logger3.middleware";
import {AuthGuard} from "./can.activate";
import * as process from "process";
import {MyLogger} from "./my-logger/my-logger.service";
import {LoggingInterceptor} from "./logging.interceptor";
import {TransformInterceptor} from "./transform.interceptor";
import {TaskService} from "./batch/task.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(MyLogger))

  app.useGlobalInterceptors(
      // new LoggingInterceptor(),
      new TransformInterceptor(),);
  // app.use(logger3);
  // app.useGlobalGuards(new AuthGuard());
  // app.useGlobalPipes(new ValidationPipe({
  //   transform: true,
  // }));
  await app.listen(3000);
}
bootstrap();
