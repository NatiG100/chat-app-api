import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilService } from 'src/util.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
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
    //if group doesn't esist throw an error
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

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
