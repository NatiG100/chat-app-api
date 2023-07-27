import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilService } from 'src/util.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { APIFeaturesDto, APIFeaturesSingleDto } from 'src/dto/APIFeaturesDto';
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

  async findOne(id: number, query:APIFeaturesSingleDto) {
    let {select} = this.util.apiFeaturesSingle(query);
    select = this.sanitizeSelect(select);
    const group = await this.prisma.group.findUnique({where:{id},select});
    if(!group){
      throw new HttpException({
        status:HttpStatus.NOT_FOUND,
        error:"Group with the provided id is not found"
      },HttpStatus.NOT_FOUND,)
    }
    return group;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
