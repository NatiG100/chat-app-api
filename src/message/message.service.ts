import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private readonly prisma:PrismaService){}
  async sendMessageToUser(createMessageDto: CreateMessageDto,from:number,to:number) {
    let message:Message;
    const chat = await this.prisma.chat.findFirst({where:{OR:[{user1Id:from,user2Id:to},{user1Id:to,user2Id:from}]}})
    console.log(chat);
    if(chat){
      message = await this.prisma.message.create({data:{chatId:chat.id,type:"TEXT",timeStamp:new Date(),senderId:from,text:createMessageDto.text}})
    }else{
      message = await this.prisma.$transaction(async()=>{
        const chat = await this.prisma.chat.create({data:{user1Id:from,user2Id:to}});
        return await this.prisma.message.create({data:{chatId:chat.id,type:"TEXT",timeStamp:new Date(),senderId:from,text:createMessageDto.text}})
      })  
    }
    
    return message;
  }
  async sendMessage(createMessageDto:CreateMessageDto,from:number,chatId:number){
    return await this.prisma.message.create({data:{chatId,type:"TEXT",timeStamp:new Date(),senderId:from,text:createMessageDto.text}})
  }
  async sendMessageToGroup(createMessageDto:CreateMessageDto,from:number,groupId:number){
    const chat = await this.prisma.chat.findFirst({where:{groupId:groupId}})
    let message:Message;
    if(chat){
      message = await this.prisma.message.create({data:{chatId:chat.id,type:"TEXT",timeStamp:new Date(),senderId:from,text:createMessageDto.text}})
    }else{
      message = await this.prisma.$transaction(async()=>{
        const chat = await this.prisma.chat.create({data:{group:{connect:{id:groupId}}}});
        return await this.prisma.message.create({data:{chatId:chat.id,type:"TEXT",timeStamp:new Date(),senderId:from,text:createMessageDto.text}})
      })  
    }
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
