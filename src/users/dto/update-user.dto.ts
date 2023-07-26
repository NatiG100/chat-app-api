import { PartialType,OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto,["password"])) {
    profileImg?:any
}
export class ChangeUserStatusDto{
    @IsEnum({SUSPENDED:"SUSPENDED",ACTIVE:"ACTIVE"},{message:"status must be either `SUSPENDED` or `ACTIVE` "})
    status:"SUSPENDED"|"ACTIVE";
}