import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction,Response,Request} from "express";

@Injectable()
export class Logger2Middleware implements NestMiddleware{
    use(req:Request, res: Response, next: NextFunction){
        console.log('Request2...');
        // res.send('DONE');
        next();
    }
}