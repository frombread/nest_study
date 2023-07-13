import { Module } from '@nestjs/common';
import { UsersService } from "./UsersService";
import { UsersController } from './users.controller';
import {EmailModule} from "../email/email.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [EmailModule,AuthModule,
    TypeOrmModule.forFeature([UserEntity])
    ],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
