import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/prisma/prisma.service";
import { permissions } from "src/types";

@Injectable()
export class SuperAdminGuard implements CanActivate{
    constructor(private readonly prisma:PrismaService, private reflector:Reflector){}
    async canActivate(context:ExecutionContext){
        //get the request object
        const request = context.switchToHttp().getRequest();
        //get group id from request param
        const groupId = +request.params.id as number;
        //get userId from user object in request obj
        const userId = request.user.id;
        //if user is the super admin of the group allow him
        const groupAdmin = await this.prisma.group.findUnique({where:{id:groupId},select:{superAdminId:true}});
        return groupAdmin.superAdminId===userId
    }
}