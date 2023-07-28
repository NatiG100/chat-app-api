import { HttpException, HttpStatus, Injectable,ConflictException,NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilService } from 'src/util/util.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MembersService {
  constructor(private prisma:PrismaService,private util:UtilService,private config:ConfigService){}
  async create({userId}: CreateMemberDto,groupId:number) {
    await this.prisma.userGroup.create({data:{groupId,userId}})
  }

  findAll() {
    return `This action returns all members`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
