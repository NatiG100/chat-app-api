import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilService } from 'src/util.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { APIFeaturesDto } from 'src/dto/APIFeaturesDto';
import { Group } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private prisma:PrismaService,private util:UtilService,private config:ConfigService){}
  create(createGroupDto: CreateGroupDto,myId:number) {
    return this.prisma.group.create({data:{...createGroupDto,superAdminId:myId}});
  }
  //takes a select object and makes sure that it contains only the avaliable fields
  private sanitizeSelect(select:object){
    let userKeys:(keyof Group) []=["id","name","description",'profileImg',"id"];
    Object.keys(select).forEach((key)=>{
      if(!userKeys.includes(key as keyof Group)){
        delete select[key]
      }
    })
    if(Object.keys(select).length===0){
      userKeys.forEach((key)=>select[key]=true);
    }
    return select;
  }
  
  async findAll(query:APIFeaturesDto) {
    let {select,take,skip} = this.util.apiFeatures(query);
    select = this.sanitizeSelect(select);
    select = {id:true,...select}
    const [groups,totalCount] = await this.prisma.$transaction([
      this.prisma.group.findMany({select,take,skip}),
      this.prisma.group.count(),
    ]);
    return {
      meta:{totalCount},
      data:groups
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
