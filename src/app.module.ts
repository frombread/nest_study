import { Module } from '@nestjs/common';
import {UsersModule} from "./users/users.module";
import {EmailModule} from "./email/email.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {CommonModule} from "./common.module";

// @Module({
//   imports: [UsersModule, EmailModule],
//   controllers: [],
//   providers: []
// })
// export class AppModule { }

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: (process.env.NODE_ENV === 'production')? '.production.env'
        :(process.env.NODE_ENV ==='stage')? '.stage.env': '.development.env'
  })],
  controllers: [AppController],
  providers: [AppService,ConfigService]
})
export class AppModule { }
