import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilService } from 'src/util/util.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { APIFeaturesDto, APIFeaturesSingleDto } from 'src/dto/APIFeaturesDto';
import { Group } from '@prisma/client';
import { uploadFile } from '@uploadcare/upload-client';
import { UploadcareSimpleAuthSchema, deleteFile, storeFile } from '@uploadcare/rest-client';

@Injectable()
export class GroupsService {
  constructor(private prisma:PrismaService,private util:UtilService,private config:ConfigService){}
  uploadCareAuthSchema = new UploadcareSimpleAuthSchema({
    publicKey:this.config.get("UPLOADCARE_PUBLIC"),
    secretKey:this.config.get("UPLOADCARE_SECRETE"),
  })
  create(createGroupDto: CreateGroupDto,myId:number) {
    return this.prisma.$transaction(async(tx)=>{
      const group = await tx.group.create({data:{...createGroupDto,superAdminId:myId}});
      return await tx.userGroup.create({data:{groupId:group.id,userId:myId}})
    })
  }
  //takes a select object and makes sure that it contains only the available fields
  private sanitizeSelect(select:object){
    let userKeys:(keyof Group) []=["id","name","description",'profileImg',"id","link"];
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
    type CustomFilter = {contains:string,mode:"insensitive"}
    let filter:{OR:{name?:CustomFilter}[]}[] = [];
    if(query.query){
      const queryString = query.query as string;
      queryString.split(' ').forEach((q)=>{
        if(q!==''){
          filter.push({OR:[{name:{contains:q,mode:"insensitive"}}]})
        }
      })
    }
    const [groups,totalCount] = await this.prisma.$transaction([
      this.prisma.group.findMany({select,take,skip,where:{OR:[...filter,{link:{equals:query.query}}]}}),
      this.prisma.group.count(),
    ]);
    return {
      meta:{totalCount},
      data:groups
    }
  }

  async findOne(id: number, query:APIFeaturesSingleDto,) {
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

  async update(id: number, {profileImg,name,description}: UpdateGroupDto,file?:Express.Multer.File) {
    //if group doesn't exist throw an error
    const group = await this.prisma.group.findUnique({where:{id},select:{id:true,profileImg}})
    if(!group){
      throw new HttpException({
        status:HttpStatus.NOT_FOUND,
        error:"Group with the provided id is not found"
      },HttpStatus.NOT_FOUND,)
    }
    let updatedGroup:Group;
    if(file){
      //upload the image
      const uploadResult = await uploadFile(file.buffer,{publicKey:'07af5eee39423b7e62d5',store:false});
  
      //update the group table
      updatedGroup = await this.prisma.group.update({where:{id},data:{name,description,profileImg:uploadResult.uuid}});
  
      //store the image permanently
      const storeResult = await storeFile({uuid:uploadResult.uuid},{authSchema:this.uploadCareAuthSchema});
  
      //delete image if it exists
      if(group.profileImg){
        await deleteFile({uuid:group.profileImg},{authSchema:this.uploadCareAuthSchema})  
      }
    }else{
      updatedGroup = await this.prisma.group.update({where:{id},data:{name,description}});
    }
    return updatedGroup;
  }

  async transfer(id:number,to:number){
    const group = await this.prisma.group.findUnique({where:{id},select:{id:true,superAdminId:true}})
    if(!group){
      throw new NotFoundException("The group with the provided id doesn't exist")
    }
    if(group.superAdminId===to){
      throw new BadRequestException("The user is already the super-admin of this group.")
    }
    const userGroup = await this.prisma.userGroup.findUnique({where:{userId_groupId:{groupId:id,userId:to}}})
    if((!userGroup) || userGroup.blocked){
      throw new BadRequestException("Either the user is not a member of this group or he/she is blocked.")
    }
    await this.prisma.group.update({where:{id},data:{superAdminId:to}});
    return {message:"You have successfully transferred the ownership of the user."}
  }

  async remove(id: number) {
    const group = await this.prisma.group.findUnique({where:{id}});
    if(!group){
      throw new HttpException({
        status:HttpStatus.NOT_FOUND,
        error:"Group with the provided id not found"
      },HttpStatus.NOT_FOUND,)
    }
    return this.prisma.group.delete({where:{id}})
  }
}
