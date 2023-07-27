import { PartialType,OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto{
    @IsOptional()
    profileImg?:any

    @IsOptional()
    @IsString({message:"First name should be a string value"})
    firstName:string
    
    @IsOptional()
    @IsString()
    lastName?:string

    @IsOptional()
    @IsString()
    username:string

    @IsOptional()
    @IsPhoneNumber()
    phoneNumber:string
}
export class ChangeUserStatusDto{
    @IsEnum({SUSPENDED:"SUSPENDED",ACTIVE:"ACTIVE"},{message:"status must be either `SUSPENDED` or `ACTIVE` "})
    status:"SUSPENDED"|"ACTIVE";
}