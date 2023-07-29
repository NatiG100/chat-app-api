import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { permissions } from 'src/types';

@Injectable()
export class AdminsService {

  constructor(private readonly prisma:PrismaService){}
  async create({userId}: CreateAdminDto,groupId:number) {
    const userGroup = await this.prisma.userGroup.findUnique({where:{userId_groupId:{groupId,userId}}});
    if(!userGroup){
      throw new NotFoundException("We couldn't find a member of this group with the provided id.")
    }
    const group = await this.prisma.group.findUnique({where:{id:groupId}});
    if(group.superAdminId===userId){
      throw new ForbiddenException("This user is already a super-admin");
    }
    const[_,__,userGroupPermission] = await this.prisma.$transaction([
      this.prisma.adminGroup.create({data:{groupId,userId}}),
      this.prisma.userGroupPermission.create({data:{groupId,userId,permissionId:permissions.ADD_MEMBER}}),
      this.prisma.userGroupPermission.create({data:{groupId,userId,permissionId:permissions.CHANGE_MEMBER_STATUS}})
    ])
  }

  async findAll(groupId:number) {
    const groupAdmins = await this.prisma.adminGroup.findMany({
      where:{groupId},
      include:{user:{select:{id:true,firstName:true,lastName:true,profileImg:true,username:true}},permissions:{select:{permission:{}}},}
    });
    groupAdmins.forEach((admin)=>{
      admin.permissions = admin.permissions.map((p)=>(p.permission)) as any
    })
    if(groupAdmins){
      return groupAdmins
    }else{
      throw new NotFoundException("Group with this id was not found")
    }
  }

  remove(userId: number,groupId:number) {
    return this.prisma.adminGroup.delete({
      where:{userId_groupId:{userId,groupId}}
    })
  }
  removePermission(groupId:number,userId: number, permissionId:number,updateAdminDto: UpdateAdminDto) {
    return this.prisma.userGroupPermission.delete({
      where:{userId_groupId_permissionId:{groupId,permissionId,userId}},
    })
  }
  addPermission(groupId:number,userId: number, permissionId:number,updateAdminDto: UpdateAdminDto) {
    return this.prisma.userGroupPermission.create({data:{groupId,permissionId,userId}})
  }

}
