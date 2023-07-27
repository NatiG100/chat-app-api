import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';
import { IsOptional, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateGroupDto {
    @IsOptional()
    profileImg?:any
    
    @IsOptional()
    @IsString()
    name:string

    @IsOptional()
    @IsString()
    description?:string
}