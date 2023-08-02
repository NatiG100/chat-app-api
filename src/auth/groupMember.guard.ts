import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/prisma/prisma.service";
import { permissions } from "src/types";

@Injectable()
export class UserInGroupChatGuard implements CanActivate{
    constructor(private readonly prisma:PrismaService, private reflector:Reflector){}
    async canActivate(context:ExecutionContext){
        //get the request object
        const request = context.switchToHttp().getRequest();
        //get group id from request param
        const chatId = +request.params.chat as number;
        //get userId from user object in request obj
        const userId = request.user.id;
        //if the chat is group chat check if the user is a member
        const {groupId} = await this.prisma.chat.findUnique({where:{id:chatId},select:{groupId:true}});
        if(groupId){
            const userGroup = await this.prisma.userGroup.findUnique({where:{userId_groupId:{userId,groupId}}})
            return userGroup&&true;
        }else{
            return true;
        }
    }
}

@Injectable()
export class UserInGroupGuard implements CanActivate{
    constructor(private readonly prisma:PrismaService, private reflector:Reflector){}
    async canActivate(context:ExecutionContext){
        //get the request object
        const request = context.switchToHttp().getRequest();
        //get group id from request param
        const groupId = +request.params.to as number;
        //get userId from user object in request obj
        const userId = request.user.id;
        //if the chat is group chat check if the user is a member
        const userGroup = await this.prisma.userGroup.findUnique({where:{userId_groupId:{userId,groupId}}})
        return userGroup&&true;
    }
}