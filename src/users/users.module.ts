import { Module } from '@nestjs/common';
import { UsersService } from "./UsersService";
import { UsersController } from './users.controller';

@Module({
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
