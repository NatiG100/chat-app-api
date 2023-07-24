import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService){}
  async create({password,...createUserDto}: CreateUserDto) {
      return this.prisma.user.create({data:{...createUserDto,salt:"salt",hash:"hash"}});
  }

  apiFeatures(query){
    const select:any = {}
    if(query.select){
      query.select.forEach((selectItem)=>{select[selectItem]=true});
    }
    return {select};
  }
  async findAll(query:any) {
    const {select} = this.apiFeatures(query);
    select.hash = false;
    select.salt = true;
    return this.prisma.user.findMany();
  }

  async findOne(id: number, query:any) {
    const {select} = this.apiFeatures(query);
    select.hash = false;
    select.salt = true;
    return this.prisma.user.findUnique({where:{id}})
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.prisma.user.delete({where:{id}})
  }
}
