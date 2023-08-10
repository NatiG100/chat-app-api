import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query, 
  UseInterceptors, 
  UploadedFile, 
  ParseFilePipe, 
  FileTypeValidator, 
  MaxFileSizeValidator,
  UseGuards, 
  Request,
  Next,
  Res,
  UseFilters, 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeUserStatusDto, UpdateUserDto } from './dto/update-user.dto';
import { APIFeaturesDto, APIFeaturesSingleDto } from 'src/dto/APIFeaturesDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { NextFunction, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //register
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //fetch many users
  @UseGuards(AuthenticatedGuard)
  @Get()
  findAll(@Query() query:APIFeaturesDto) {
    return this.usersService.findAll(query);
  }

  //fetch one user
  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Query() query:APIFeaturesSingleDto) {
    return this.usersService.findOne(+id,query);
  }

  //update self
  @UseGuards(AuthenticatedGuard)
  @Patch('')
  @UseInterceptors(FileInterceptor('profileImg'))
  async update(@Request() req:any, @Body() updateUserDto: UpdateUserDto, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
      ],
      fileIsRequired:false
    })
  ) file?:Express.Multer.File) {
    delete (updateUserDto as any)?.id
    delete (updateUserDto as any)?.status
    return this.usersService.update(req.session.passport.user.id, updateUserDto,file);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id/status')
  async changeStatus(@Param('id') id:string,@Body() status: ChangeUserStatusDto){
    return this.usersService.changeStatus(+id,status)
  }
  
  //delete account
  @UseGuards(AuthenticatedGuard)
  @Delete('')
  remove(@Request() req:any,@Next() next:NextFunction, @Res() res:Response) {
    const result  = this.usersService.remove(req.session.passport.user.id);
    req.logOut(function(error:Error){
        if(error){
            return next(error);
        }
        res.json({
          result,
        })
    });
  }
}
