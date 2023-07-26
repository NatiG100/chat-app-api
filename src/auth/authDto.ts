import { IsEmail, IsInt, IsString, MinLength } from 'class-validator';

/** Describes the fields needed to create a Department */
export class LoginDto {
    @IsString({message:"Password is required"})
    password: string;
    @IsString({message:"Username is required"})
    username: string;
}


export class ChangePasswordDto {
    
    @IsString({message:"The old password is required"})
    oldPassword: string;
    
    @IsString({message:"New password is required"})
    @MinLength(8,{message:"Password should have a minimum of 8 characters"})
    newPassword: string;
  
    @IsString({message:"Please confirm your password"})
    confirmPassword: string;
  }
  