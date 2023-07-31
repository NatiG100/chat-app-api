import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthenticatedGuard)
  @Post('touser/:to')
  sendToUser(@Body() createMessageDto: CreateMessageDto,@Request() req:any,@Param('to') to: string) {
    return this.messageService.sendMessageToUser(createMessageDto,req.user.id,+to);
  }
  @UseGuards(AuthenticatedGuard)
  @Post(':chat')
  sendToChat(@Body() createMessageDto: CreateMessageDto,@Request() req:any,@Param('chat') chat: string) {
    return this.messageService.sendMessage(createMessageDto,req.user.id,+chat);
  }
  @UseGuards(AuthenticatedGuard)
  @Post('togroup/:to')
  sendToGroup(@Body() createMessageDto: CreateMessageDto,@Request() req:any,@Param('to') to: string) {
    return this.messageService.sendMessageToGroup(createMessageDto,req.user.id,+to);
  }

  @Get('')
  findAll(@Query('chatId') chatId: string) {
    return this.messageService.findAll(+chatId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
