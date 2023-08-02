import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { permissions } from 'src/types';
import { Roles } from 'src/roles/roles.decorator';
import { GroupAdminWithRoleGuard } from 'src/auth/groupAdmin.guard';

@Controller('groups/:groupId/admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @UseGuards(new AuthenticatedGuard())
  @Roles(permissions.ADD_ADMIN)
  @UseGuards(GroupAdminWithRoleGuard)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto,@Param('groupId') groupId: string) {
    return this.adminsService.create(createAdminDto,+groupId);
  }
  @UseGuards(new AuthenticatedGuard())
  @Roles(permissions.FETCH_ADMINS)
  @UseGuards(GroupAdminWithRoleGuard)
  @Post()
  @Get()
  findAll(@Param('groupId') groupId: string) {
    return this.adminsService.findAll(+groupId);
  }

  @UseGuards(new AuthenticatedGuard())
  @Roles(permissions.REMOVE_ADMIN)
  @UseGuards(GroupAdminWithRoleGuard)
  @Post()
  @Delete(':id')
  remove(@Param('groupId') groupId:string,@Param('id') id: string) {
    return this.adminsService.remove(+id,+groupId);
  }
  @UseGuards(new AuthenticatedGuard())
  @Roles(permissions.CHANGE_ADMIN_STATUS)
  @UseGuards(GroupAdminWithRoleGuard)
  @Post()
  @Delete(':id/permissions/:permissionId')
  removePermission(
    @Param('groupId') groupId: string,
    @Param('permissionId') permissionId: string,
    @Param('id') userId: string, 
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.adminsService.removePermission(+groupId,+userId,+permissionId, updateAdminDto);
  }
  @UseGuards(new AuthenticatedGuard())
  @Roles(permissions.CHANGE_ADMIN_STATUS)
  @UseGuards(GroupAdminWithRoleGuard)
  @Post()
  @Post(':id/permissions/:permissionId')
  addPermission(
    @Param('groupId') groupId: string,
    @Param('permissionId') permissionId: string,
    @Param('id') userId: string, 
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.adminsService.addPermission(+groupId,+userId,+permissionId, updateAdminDto);
  }
}
