import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query
} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {UserInfo} from "./UserInfo";
import {UsersService} from "./UsersService";
import {ValidationPipe} from "../validation.pipe";
// import {ValidationPipe} from "@nestjs/common";

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {
    }

    @Get(':id')
    findOne(@Param('id', ValidationPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Get()
    findAll(
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        console.log(offset, limit);

        return this.userService.findAll();
    }



    @Post('/email-verify')
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const {signupVerifyToken} = dto;
        return await this.userService.verifyEmail(signupVerifyToken);
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        const {email, password} = dto;
        return await this.userService.login(email, password);
    }

    @Get('/:id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
        console.log(userId);
        return;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

    @Post()
    create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto.name,createUserDto.email,createUserDto.password);
    }
}