import { HttpException, HttpStatus, Injectable,ConflictException,NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilService } from 'src/util/util.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MembersService {
  constructor(private prisma:PrismaService,private util:UtilService,private config:ConfigService){}
  async create({userId}: CreateMemberDto,groupId:number) {
    await this.prisma.userGroup.create({data:{groupId,userId}})
    return {message:"New member added"}
  }

  async findAll(groupId:number) {
    const groupMembers = await this.prisma.group.findUnique({select:{
      id:true,
      members:{
        select:{
          user:{
            select:{
              id:true,
              firstName:true,
              lastName:true,
              username:true,
              profileImg:true
            }
          },
          blocked:true,
        }
      },
      superAdmin:{
        select:{id:true,firstName:true,lastName:true,username:true,profileImg:true}
      },
      admins:{
        select:{permissions:{select:{permission:true}},userId:true}
      }
    },where:{id:groupId}})
    if(groupMembers){
      return groupMembers
    }else{
      throw new NotFoundException("Group with this id was not found")
    }
  }

  async update(userId: number,groupId:number,status:boolean) {
    const group = await this.prisma.group.findUnique({where:{id:groupId},select:{superAdminId:true}});
    if(group.superAdminId===userId){
      throw new ForbiddenException("Super-admin can't be blocked.")
    }
    await this.prisma.userGroup.update({where:{userId_groupId:{groupId,userId}},data:{blocked:status}})
    return {message:"Status successfully changed."}
  }

  async remove(id: number,groupId:number) {
    const group = await this.prisma.group.findUnique({where:{id:groupId},select:{superAdminId:true}});
    if(group.superAdminId===id){
      throw new ForbiddenException("Since you are the super-admin of this group you are not allowed to leave it.")
    }
    await this.prisma.userGroup.delete({where:{userId_groupId:{userId:id,groupId}}})
    return {message:"You have successfully left the group"};
  }
}
