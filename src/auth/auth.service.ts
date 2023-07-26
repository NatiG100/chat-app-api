import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/util.service';
import { ChangePasswordDto } from './authDto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma:PrismaService, private readonly util:UtilService){}

    async validateUser(username:string,pass:string):Promise<any>{
        const user = await this.prisma.user.findUnique({where:{username}});
        if(this.util.check(pass,user.hash,user.salt)){
            const {hash,salt,...result} = user;
            return result;
        }
        return null;
    }
    async me(id:number){
        const {hash,salt,...result} = await this.prisma.user.findUnique({where:{id}});
        return result;
    }
    async changePassword(id:number,{oldPassword,newPassword,confirmPassword}:ChangePasswordDto){
        //make sure that passwords match
        if(newPassword!==confirmPassword){
            throw new HttpException({
                status:HttpStatus.BAD_REQUEST,
                error:"Passwords don't match"
            },HttpStatus.BAD_REQUEST,)
        }
        //check if the old password is authentic
        const user = await this.prisma.user.findUnique({where:{id}})
        if(!this.util.check(oldPassword,user.hash,user.salt)){
            throw new UnauthorizedException();
        }
        //generate new salt and hash
        const {hash,salt} = this.util.hash(newPassword);
        await this.prisma.user.update({where:{id},data:{hash,salt}})
    }
}
