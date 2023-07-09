import { Module } from '@nestjs/common';
import { UsersService } from "./UsersService";
import { UsersController } from './users.controller';
import {EmailModule} from "../email/email.module";

@Module({
    imports: [EmailModule],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
