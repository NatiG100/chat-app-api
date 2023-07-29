import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('groups/:groupId/admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto,@Param('groupId') groupId: string) {
    return this.adminsService.create(createAdminDto,+groupId);
  }

  @Get()
  findAll(@Param('groupId') groupId: string) {
    return this.adminsService.findAll(+groupId);
  }

  @Delete(':id/permissions/:permissionId')
  removePermission(
    @Param('groupId') groupId: string,
    @Param('permissionId') permissionId: string,
    @Param('id') userId: string, 
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.adminsService.removePermission(+groupId,+userId,+permissionId, updateAdminDto);
  }
  @Post(':id/permissions/:permissionId')
  addPermission(
    @Param('groupId') groupId: string,
    @Param('permissionId') permissionId: string,
    @Param('id') userId: string, 
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.adminsService.addPermission(+groupId,+userId,+permissionId, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id);
  }
}
