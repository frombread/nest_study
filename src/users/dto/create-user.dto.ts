import {Body, Post} from "@nestjs/common";
export class CreateUserDto {
    name: string;
    email: string;
}

