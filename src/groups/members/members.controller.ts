import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Request, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@Controller('groups/:groupId/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto,@Param('groupId') groupId: string) {
    return this.membersService.create(createMemberDto,+groupId);
  }

  @Get()
  findAll(@Param('groupId') groupId: string) {
    return this.membersService.findAll(+groupId);
  }

  @Patch(':id')
  findOne(@Param('id') id: string,@Param('groupId') groupId: string,@Query('blocked') blocked: "true"|"false") {
    if(blocked!=="true"&&blocked!=="false"){
      throw new BadRequestException({message:"Value of blocked must be either `TRUE` or `FALSE`"})
    }
    return this.membersService.update(+id,+groupId,blocked==="true");
  }

  @UseGuards(AuthenticatedGuard)
  @Delete()
  remove(@Request() req:any,@Param('groupId') groupId: string) {
    return this.membersService.remove(+req.user.id,+groupId);
  }
}
