import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {UsersModule} from "./users/users.module";
import {ConfigModule} from "@nestjs/config";
import emailConfig from "./config/email.config";
import {validationSchema} from "./config/validation.schema";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./users/user.entity";
import {LoggerMiddleware} from "./logger.middleware";
import {Logger2Middleware} from "./logger2.middleware";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./can.activate";
import authConfig from "./config/auth.config";
import {AppService} from "./app.service";
import {AppController} from "./app.controller";
import { LoggerModule } from './my-logger/my-logger.module';
import {utilities as nestWinstonModuleUtilities, WinstonModule} from "nest-winston";
import * as winston from "winston";
import {createNestWinstonLogger} from "nest-winston/dist/winston.providers";
import {LoggingModule} from "./logging.module";
import { BatchModule } from './batch/batch.module';

// @Module({
//   imports: [UsersModule, EmailModule],
//   controllers: [],
//   providers: []
// })
// export class AppModule { }

@Module({
  imports:[
      UsersModule,
      ConfigModule.forRoot({
        envFilePath:[`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
        load : [emailConfig,authConfig],
        isGlobal : true,
        validationSchema,
      }),
      TypeOrmModule.forRoot({
          type:'mysql',
          host: process.env.DATABASE_HOST,
          port: 3306,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: 'test',
          entities: [UserEntity],
          synchronize: true,
      }),
      LoggerModule,
      LoggingModule,
      WinstonModule.forRoot({
          transports:[
              new winston.transports.Console({
                  level: process.env.NODE_ENV === 'production'? 'info':'silly',format:winston.format.combine(
                      winston.format.timestamp(),
                      nestWinstonModuleUtilities.format.nestLike('Myapp',{prettyPrint:true}),
                  )
              })
          ]
      }),
      BatchModule
  ],
  controllers:[AppController],
  providers:[{
      provide: APP_GUARD,
      useClass:AuthGuard,
  },
  AppService,],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any{
        consumer.apply(LoggerMiddleware,Logger2Middleware)
            // .exclude({path: '/users', method:RequestMethod.GET})
            .forRoutes('/users');
    }
}
