import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  findAll(@Request() req:any,@Query('type') type:"group"|"user") {
    return this.chatService.findAll(req.user.id,type);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(":id")
  findOne(@Param('id') id: string,@Request() req:any){
    return this.chatService.findOne(req.user.id,+id);
  }
  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  remove(@Param('id') id: string,@Request() req:any) {
    return this.chatService.remove(req.user.id, +id);
  }
}
