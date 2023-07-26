import { Controller, Get, Post, Body, Patch, Param, Delete,Query, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { APIFeaturesDto, APIFeaturesSingleDto } from 'src/dto/APIFeaturesDto';
import { FileInterceptor } from '@nestjs/platform-express';
import {uploadFile} from '@uploadcare/upload-client'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query:APIFeaturesDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query:APIFeaturesSingleDto) {
    return this.usersService.findOne(+id,query);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImg'))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
      ],
    }),
  ) file:Express.Multer.File) {
    
    return this.usersService.update(+id, updateUserDto,file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
