import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {UsersModule} from "./users/users.module";
import {ConfigModule} from "@nestjs/config";
import emailConfig from "./config/email.config";
import {validationSchema} from "./config/validation.schema";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./users/user.entity";
import {LoggerMiddleware} from "./logger.middleware";
import {Logger2Middleware} from "./logger2.middleware";

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
        load : [emailConfig],
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
  ],
  // controllers:[],
  // providers:[],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any{
        consumer.apply(LoggerMiddleware,Logger2Middleware)
            // .exclude({path: '/users', method:RequestMethod.GET})
            .forRoutes('/users');
    }
}
