import { Type } from "class-transformer"
import { IsArray, IsInt, IsOptional, IsString, isString } from "class-validator"

export class APIFeaturesDto{
    @IsOptional()
    @IsArray({message:"Select should be an array"})
    @IsString({each:true,message:"Select should be an array of string"})
    select?:string[]
    
    @IsOptional()
    @IsString({message:"Query should be a string"})
    query?:string

    @IsOptional()
    @Type(() => Number)
    @IsInt({message:"Page should be an integer"})
    page?:number
    
    @IsOptional()
    @Type(() => Number)
    @IsInt({message:"Limit should be an integer"})
    limit?:number

}

export class APIFeaturesSingleDto{
    @IsOptional()
    @IsArray({message:"Select should be an array"})
    @IsString({each:true,message:"Select should be an array of string"})
    select?:string[]
}