import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as uuid from "uuid"
import { EmailService} from "../email/email.service";
import {UserInfo} from "./UserInfo";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {DataSource, Repository} from "typeorm";
import {ulid} from "ulid";
import {AuthService} from "../auth/auth.service";

// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private emailService: EmailService, private dataSource: DataSource,private authService: AuthService,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) {}
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
        const userExist = await this.checkUserExists(email);
        if(userExist){
            throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.')
        }

        const signupVerifyToken =uuid.v1();

        // await this.saveUser(name,email,password,signupVerifyToken);
        await this.saveUserUsingQueryRunner(name,email,password,signupVerifyToken);
        await this.sendMemberJoinEmail(email,signupVerifyToken);

    }
    private async checkUserExists(emailAddress: string){
        const user = await this.userRepository.findOne({
            where:{ email : emailAddress}
        });
        return user!= null;
        // return user!==undefined;
    }

    private async saveUser(name: string, email: string, password: string, signupVerifyToken:string){
        const user = new UserEntity();
        user.id = ulid()
        user.name = name;
        user.email = email;
        user.password = password;
        user.signupVerifyToken= signupVerifyToken;

        await this.userRepository.save(user);
    }
    private async sendMemberJoinEmail(email: string,signupVerifyToken:string){
        await this.emailService.sendMemberJoinVerification(email,signupVerifyToken);
    }

    async verifyEmail(signupVerifyToken: string): Promise<string>{
        const user = await this.userRepository.findOne({
            where:{ signupVerifyToken}
        });

        if(!user){
            throw new NotFoundException("유저가 존재하지 않습니다!")
        }
        //TODO
        //1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
        //2. 바로 로그인 상태가 되도록 jwt를 발급
        return this.authService.login({
            id:user.id,
            name:user.name,
            email:user.email,
        })
    }
    async login(email: string, password: string): Promise<string>{
        const user = await this.userRepository.findOne({
            where: {email,password}
        });
        if(!user){
            throw new NotFoundException('유저가 존재하지 않습니다.')
        }
        return this.authService.login({
            id:user.id,
            name:user.name,
            email:user.email,
        })
        //TODO
        //1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러처리
        //2. JWT를 발급
    }
    async getUSerInfo(userId: string):Promise<UserInfo>{
        const user =await this.userRepository.findOne({
            where: {id:userId}
        });

        if (!user){
            throw new NotFoundException('유저가 존재하지 않습니다.')
        }
        return{
            id:user.id,
            name : user.name,
            email:user.email,
        }
        //TODO
        //1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
        //2. 조회된 데이터를 UserInfo 타입으로 응답
    }
    // private async saveUserUsingQueryRunner(name: string, email:string, password:string, signupVerifyToken:string){
    //     const queryRunner = this.dataSource.createQueryRunner();
    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();
    //
    //     try{
    //         const user = new UserEntity();
    //         user.id = ulid();
    //         user.name = name;
    //         user.email=email;
    //         user.password=password;
    //         user.signupVerifyToken=signupVerifyToken;
    //
    //         await queryRunner.manager.save(user);
    //         await queryRunner.commitTransaction();
    //     } catch (e) {
    //         await queryRunner.rollbackTransaction();
    //     } finally {
    //         await queryRunner.release()
    //     }
    // }
    private async saveUserUsingQueryRunner(name: string, email:string, password:string, signupVerifyToken:string) {
        await this.dataSource.transaction(async manager => {
            const user = new UserEntity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;

            await manager.save(user);
            // throw new InternalServerErrorException();
        });
    }


}