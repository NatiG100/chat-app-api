import { Injectable,HttpException,HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { APIFeaturesSingleDto } from 'src/dto/APIFeaturesDto';
import { User } from '@prisma/client';
import { UtilService } from 'src/util.service';


@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService,private util:UtilService){}
  async create({password,...createUserDto}: CreateUserDto) {
      return this.prisma.user.create({data:{...createUserDto,salt:"salt",hash:"hash"}});
  }

  //takes a select object and makes sure that it contains only the avaliable fields
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
    select = {id:true,...select}
    const [users,totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({select,take,skip}),
      this.prisma.user.count(),
    ]);
    return {
      meta:{totalCount},
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  
  async remove(id: number) {
    const user = await this.prisma.user.findUnique({where:{id}});
    if(!user){
      throw new HttpException({
        status:HttpStatus.NOT_FOUND,
        error:"User with the provided id not found"
      },HttpStatus.NOT_FOUND,)
    }
    return this.prisma.user.delete({where:{id}})
  }
}
