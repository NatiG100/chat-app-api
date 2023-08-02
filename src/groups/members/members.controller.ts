import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Request, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { Roles } from 'src/roles/roles.decorator';
import { permissions } from 'src/types';
import { GroupAdminWithRoleGuard } from 'src/auth/groupAdmin.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('groups/:groupId/members')
export class MembersController {
  constructor(private readonly membersService: MembersService,private prisma:PrismaService) {}

  @UseGuards(new AuthenticatedGuard())
  @Roles(permissions.ADD_MEMBER)
  @UseGuards(GroupAdminWithRoleGuard)
  @Post()
  create(@Body() createMemberDto: CreateMemberDto,@Param('groupId') groupId: string) {
    return this.membersService.create(createMemberDto,+groupId);
  }

  @Get()
  findAll(@Param('groupId') groupId: string) {
    return this.membersService.findAll(+groupId);
  }

  @UseGuards(new AuthenticatedGuard())
  @Roles(permissions.CHANGE_MEMBER_STATUS)
  @UseGuards(GroupAdminWithRoleGuard)
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
