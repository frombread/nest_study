import {Controller, Get, UseGuards} from "@nestjs/common";
import {CommonService} from "./common.service";
import {ConfigService} from "@nestjs/config";
import {AuthGuard} from "./can.activate";
import {AppService} from "./app.service";
import { InternalServerErrorException} from "@nestjs/common";

@UseGuards(AuthGuard)
@Controller()
export class AppController{
    constructor(
        private readonly configService: ConfigService, private readonly appService:AppService
    ) { }
    @UseGuards()
    @Get()
    getHello():string{
        return this.appService.getHello()
    }
    // constructor(private readonly commonService: CommonService) {
    // }
    // @Get('/common-hello')
    // getCommonHello(): string{
    //     return this.commonService.hello();
    // }

    @Get('db-host-from-config')
    getDatabaseHostFromConfigService(): string {
        return this.configService.get('DATABASE_HOST');
    }

    @Get('/error')
    error(foo:any): string {
        return foo.bar();
    }
}