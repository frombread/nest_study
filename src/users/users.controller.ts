import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get, Header,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Headers, Inject, BadRequestException, HttpException, InternalServerErrorException, UseInterceptors
} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {UserInfo} from "./UserInfo";
import {UsersService} from "./UsersService";
import {ValidationPipe} from "../validation.pipe";
import {AuthService} from "../auth/auth.service";
import {WINSTON_MODULE_PROVIDER, WinstonLogger} from "nest-winston";
import {ErrorsInterceptor} from "../errors.interceptor";
// import {ValidationPipe} from "@nestjs/common";

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService,
                @Inject(WINSTON_MODULE_PROVIDER) private readonly logger : WinstonLogger,) {
    }

    // @Get(':id')
    // findOne(@Param('id', ValidationPipe) id: number) {
    //     return this.userService.findOne(id);
    // }

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

    @Get(':id')
    async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
        const jwtString =  headers.authorization.split('Bearer')[1];
        this.authService.verify(jwtString);
        return this.userService.getUSerInfo(userId);
    }
    @UseInterceptors(ErrorsInterceptor)
    @Get('/findOne/:id')
    findOne(@Param('id')id:string){
        throw new InternalServerErrorException();
        // if(+id<1){
        //     throw new HttpException(
        //         {
        //             errorMessage : 'id는 0보다 수',
        //             foo:'bar',
        //         },
        //         HttpStatus.BAD_REQUEST
        //     );
        // }
        // return this.userService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

    // @Post()
    // create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    //     return this.userService.createUser(createUserDto.name,createUserDto.email,createUserDto.password);
    // }
    @Post()
    async createUser(@Body() dto:CreateUserDto):Promise<void>{
        this.printWinstonLog(dto);
    }

    private printWinstonLog(dto){
        console.log(this.logger.log);

        this.logger.error('error: ',dto);
        this.logger.warn('warn: ',dto);
        // this.logger.info('info: ',dto);
        // this.logger.http('http: ',dto);
        this.logger.verbose('verbose: ',dto);
        this.logger.debug('debug: ',dto);
        // this.logger.silly('silly: ',dto);

    }
}