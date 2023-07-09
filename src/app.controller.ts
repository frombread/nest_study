import {Controller, Get} from "@nestjs/common";
import {CommonService} from "./common.service";

@Controller()
export class AppController{
    // constructor(private readonly commonService: CommonService) {
    // }
    // @Get('/common-hello')
    // getCommonHello(): string{
    //     return this.commonService.hello();
    // }
    @Get()
    getHello(): string{
        return process.env.DATABASE_HOST;
    }
}