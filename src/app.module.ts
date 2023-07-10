import { Module } from '@nestjs/common';
import {UsersModule} from "./users/users.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import emailConfig from "./config/email.config";
import {validationSchema} from "./config/validation.schema";

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
  ],
  controllers:[],
  providers:[],
})
export class AppModule { }
