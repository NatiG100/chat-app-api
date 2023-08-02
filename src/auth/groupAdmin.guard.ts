import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "src/prisma/prisma.service";
import { permissions } from "src/types";

@Injectable()
export class GroupAdminWithRoleGuard implements CanActivate{
    constructor(private readonly prisma:PrismaService, private reflector:Reflector){}
    async canActivate(context:ExecutionContext){
        //fetch permission Id from meta data
        const permissionId = this.reflector.get<permissions>('permissionId', context.getHandler());
        //get the request object
        const request = context.switchToHttp().getRequest();
        //get group id from request param
        const groupId = +request.params.groupId as number;
        //get userId from user object in request obj
        const userId = request.user.id;
        //if iser os tje super admin of the group allow whatever the permission id is
        const groupAdmin = await this.prisma.group.findUnique({where:{id:groupId},select:{superAdminId:true}});
        if(groupAdmin.superAdminId===userId){
            return true;
        }
        //else check if user-admin-permission is found in the table return true else false
        const userPermissionGroup = await this.prisma.userGroupPermission.findUnique({where:{userId_groupId_permissionId:{userId,groupId,permissionId}}})
        console.log(userPermissionGroup);
        return (userPermissionGroup&&true);
    }
}