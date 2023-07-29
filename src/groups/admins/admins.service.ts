import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { permissions } from 'src/types';

@Injectable()
export class AdminsService {

  constructor(private prisma:PrismaService){}
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
    
    // await this.prisma.group.findUnique({select:{
    //   id:true,
    //   admins:{select:{user:{select:{id:true,firstName:true,lastName:true,username:true,profileImg:true}},}},
    //   superAdmin:{
    //     select:{firstName:true,lastName:true,username:true,profileImg:true}
    //   }
    // },where:{id:groupId}})
    if(groupAdmins){
      return groupAdmins
    }else{
      throw new NotFoundException("Group with this id was not found")
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
