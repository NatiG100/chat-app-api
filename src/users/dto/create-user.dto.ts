import { IsString,IsPhoneNumber,IsOptional, MinLength, IsEnum} from "class-validator";

export class CreateUserDto {
    @IsString({message:"First name should be a string value"})
    firstName:string
    
    @IsString()
    @IsOptional()
    lastName?:string

    @IsString()
    username:string

    @IsPhoneNumber()
    phoneNumber:string

    @IsString({message:"Password should be a string value"})
    @MinLength(8,{message:"Password should have a minimum of 8 characters"})
    password:string
}
