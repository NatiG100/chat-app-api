import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, UseFilters } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { APIFeaturesDto, APIFeaturesSingleDto } from 'src/dto/APIFeaturesDto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  create(@Request() req:any,@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto,req.user.id);
  }

  @Get()
  findAll(@Query() query:APIFeaturesDto) {
    return this.groupsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query:APIFeaturesSingleDto) {
    return this.groupsService.findOne(+id,query);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImg'))
  update(@Param('id') id: string,@Body() updateGroupDto: UpdateGroupDto, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
      ],
      fileIsRequired:false
    })
  ) file?:Express.Multer.File) {
    return this.groupsService.update(+id, updateGroupDto,file);
  }

  @Patch(':id/transfer')
  transfer(@Param('id') id:string,@Query('to') to:string){
    return this.groupsService.transfer(+id,+to);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }
}
