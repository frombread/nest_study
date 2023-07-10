import {Controller, Get} from "@nestjs/common";
import {CommonService} from "./common.service";
import {ConfigService} from "@nestjs/config";

@Controller()
export class AppController{
    constructor(
        private readonly configService: ConfigService,
    ) { }
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
}