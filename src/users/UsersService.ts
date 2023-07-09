import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as uuid from "uuid"
import { EmailService} from "../email/email.service";

// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private emailService: EmailService) {
    }
    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    // update(id: number, updateUserDto: UpdateUserDto) {
    //     return `This action updates a #${id} user`;
    // }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
    async createUser(name: string, email: string, password: string){
        await this.checkUserExists(email);

        const signupVerifyToken =uuid.v1();

        await this.saveUser(name,email,password,signupVerifyToken);
        await this.sendMemberJoinEmail(email,signupVerifyToken);

    }
    private checkUserExists(email: string){
        return false; // todo DB 구현후
    }

    private saveUser(name: string, email: string, password: string, signupVerifyToken:string){
        return; // todo DB 구현후
    }
    private async sendMemberJoinEmail(email: string,signupVerifyToken:string){
        await this.emailService.sendMemberJoinVerification(email,signupVerifyToken);
    }


}