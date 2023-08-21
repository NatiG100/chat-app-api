import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { group } from 'console';

@Injectable()
export class ChatService {
  constructor(private prisma:PrismaService){}
  findAll(myId:number,type:"group"|"user") {
    const filter:any = {AND:[{OR:[{user1Id:myId},{user2Id:myId}]}]}
    if(type==="group"){
      filter.AND.push({NOT:{groupId:null}})
    }
    return this.prisma.chat.findMany({
      where:filter,
      include:{
        messages:{
          orderBy:{timeStamp:"desc"},
          take:1
        },
        user1:true,
        user2:true,
        group:true,
      }
    })
  }
  async findOne(myId:number,chatId:number){
    return this.prisma.chat.findUnique({where:{id:chatId,OR:[{user1Id:myId},{user2Id:myId}]},include:{user1:true,user2:true,group:true}})
  }
  async getChatWithUser(myId:number,userId:number){
    return this.prisma.chat.findFirst({where:{OR:[{user1Id:myId,user2Id:userId},{user2Id:myId,user1Id:userId}]}})
  }
  async getChatInGroup(myId:number,groupId:number){
    return this.prisma.chat.findFirst({where:{groupId:groupId,group:{members:{some:{userId:myId}}}}});
  }

  remove(myId:number,id: number) {
    return `This action removes a #${id} chat`;
  }
}
