import { Injectable,HttpException,HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeUserStatusDto, UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { APIFeaturesSingleDto } from 'src/dto/APIFeaturesDto';
import { User } from '@prisma/client';
import { UtilService } from 'src/util/util.service';
import { uploadFile } from '@uploadcare/upload-client';
import { UploadcareSimpleAuthSchema, deleteFile, storeFile } from '@uploadcare/rest-client';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService,private util:UtilService,private config:ConfigService){}
  uploadCareAuthSchema = new UploadcareSimpleAuthSchema({
    publicKey:this.config.get("UPLOADCARE_PUBLIC"),
    secretKey:this.config.get("UPLOADCARE_SECRETE"),
  })
  async create({password,...createUserDto}: CreateUserDto) {
      const {salt,hash} = this.util.hash(password);
      const user = await this.prisma.user.create({data:{...createUserDto,salt,hash}});
      return this.exclude(user,["hash","salt"])
  }

  //takes a select object and makes sure that it contains only the available fields
  private sanitizeSelect(select:object){
    let userKeys:(keyof User) []=["id","username","firstName","lastName","phoneNumber",'profileImg',"status"];
    Object.keys(select).forEach((key)=>{
      if(!userKeys.includes(key as keyof User)){
        delete select[key]
      }
    })
    if(Object.keys(select).length===0){
      userKeys.forEach((key)=>select[key]=true);
    }
    return select;
  }
  
  //excludes certain fields from the user object
  private exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key as Key))
    ) as Omit<User,Key>
  }

  async findAll(query:any) {
    let {select,take,skip} = this.util.apiFeatures(query);
    select = this.sanitizeSelect(select);
    select = {id:true,...select};
    type CustomFilter = {contains:string,mode:"insensitive"}
    let filter:{OR:{firstName?:CustomFilter,lastName?:CustomFilter,username?:CustomFilter}[]}[] = [];
    if(query.query){
      const queryString = query.query as string;
      queryString.split(' ').forEach((q)=>{
        if(q!==''){
          filter.push({
            OR:[
              {firstName:{contains:q,mode:"insensitive"}},
              {lastName:{contains:q,mode:"insensitive"}},
              {username:{contains:q,mode:"insensitive"}}
            ]
          })
        }
      })
    }
    let whereObj:any = {

    }
    if(query.query){
      whereObj.where = {
        OR:filter
      };
    }
    const [users] = await this.prisma.$transaction([
      this.prisma.user.findMany({select,take,skip,...whereObj})
    ]);
    return {
      meta:{totalCount:users?.length},
      data:users.map((user)=>(this.exclude(user,['hash','salt'])))
    }
  }

  async findOne(id: number, query:APIFeaturesSingleDto) {
    let {select} = this.util.apiFeaturesSingle(query);
    select = this.sanitizeSelect(select);
    const user = await this.prisma.user.findUnique({where:{id},select});
    if(!user){
      throw new HttpException({
        status:HttpStatus.NOT_FOUND,
        error:"User with the provided id not found"
      },HttpStatus.NOT_FOUND,)
    }
    return this.exclude(user,['hash','salt'])
  }

  async update(id: number, {profileImg,...otherUpdateDto}: UpdateUserDto,file?:Express.Multer.File) {
    //if user doesn't esist throw an error
    const user = await this.prisma.user.findUnique({where:{id},select:{id:true,profileImg:true}})
    if(!user){
      throw new HttpException({
        status:HttpStatus.NOT_FOUND,
        error:"User with the provided id not found"
      },HttpStatus.NOT_FOUND,)
    }
    let updatedUser:User;
    if(file){

      //upload the image
      const uploadResult = await uploadFile(file.buffer,{publicKey:'07af5eee39423b7e62d5',store:false});
  
      //update the user table
      updatedUser = await this.prisma.user.update({where:{id},data:{...otherUpdateDto,profileImg:uploadResult.uuid}});
  
      //store the image permanently
      const storeResult = await storeFile({uuid:uploadResult.uuid},{authSchema:this.uploadCareAuthSchema});
  
      //delete image if it exists
      if(user.profileImg){
        const deleted = await deleteFile({uuid:user.profileImg},{authSchema:this.uploadCareAuthSchema})  
      }
    }else{
      updatedUser = await this.prisma.user.update({where:{id},data:otherUpdateDto});
    }
    return this.exclude(updatedUser,["hash","salt"]);
  }
  async changeStatus(id:number,statusDto:ChangeUserStatusDto){
    const user = await this.prisma.user.findUnique({where:{id},select:{status:true}});
    if(!user){
      throw new HttpException({
        status:HttpStatus.NOT_FOUND,
        error:"User with the provided id not found"
      },HttpStatus.NOT_FOUND,)
    }
    if(user.status==="INACTIVE"){
      throw new HttpException({
        status:HttpStatus.FORBIDDEN,
        error:"The user is inactive"
      },HttpStatus.FORBIDDEN,)
    }
    const updatedUser = await this.prisma.user.update({where:{id},data:{status:statusDto.status}});
    return this.exclude(updatedUser,["hash","salt"]);
  }
  
  async remove(id: number) {
    const user = await this.prisma.user.findUnique({where:{id}});
    if(!user){
      throw new HttpException({
        status:HttpStatus.NOT_FOUND,
        error:"User with the provided id not found"
      },HttpStatus.NOT_FOUND,)
    }
    const deletedUser = await this.prisma.user.delete({where:{id}})
    this.exclude(deletedUser,["hash","salt"])
  }
}
