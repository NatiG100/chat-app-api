import { Optional } from "@nestjs/common";
import { IsAlphanumeric, IsString, isString } from "class-validator";

export class CreateGroupDto {
    @IsString()
    name:string

    @IsAlphanumeric()
    link:string

    @Optional()
    @IsString()
    description?:string
}
