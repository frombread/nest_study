import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as uuid from "uuid"
import { EmailService} from "../email/email.service";
import {UserInfo} from "./UserInfo";

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

    async verifyEmail(signupVerifyToken: string): Promise<string>{
        //TODO
        //1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
        //2. 바로 로그인 상태가 되도록 jwt를 발급
        throw new Error("Method not implemented");
    }
    async login(email: string, password: string): Promise<string>{
        //TODO
        //1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러처리
        //2. JWT를 발급
        throw new Error("Method not implemented");
    }
    async getUSerInfo(userId: string):Promise<UserInfo>{
        //TODO
        //1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
        //2. 조회된 데이터를 UserInfo 타입으로 응답
        throw new Error("Method not implemented");
    }
}