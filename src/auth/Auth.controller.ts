import { Body, Controller, Delete, Get, HttpException, HttpStatus, Next, Patch, Post, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { ChangePasswordDto, LoginDto } from "./authDto";
import { AuthenticatedGuard } from "./authenticated.guard";
import { NextFunction, Response } from "express";

@Controller()
export class AuthController{
    constructor(private readonly authService:AuthService){}
    @UseGuards(LocalAuthGuard)
    @Post('auth')
    async login(@Body() body:LoginDto, @Request() req:any){
        return req.user;
    }

    @UseGuards(AuthenticatedGuard)
    @Get('auth')
    whoAmI(@Request() req:any){
        return this.authService.me(req.user.id);
    }

    @UseGuards(AuthenticatedGuard)
    @Patch('auth')
    async changePassword(@Request() req:any,@Body() changeDto:ChangePasswordDto){
        await this.authService.changePassword(req.user.id,changeDto)
        return {message:"Password successfully changed"}
    }
    
    @UseGuards(AuthenticatedGuard)
    @Delete('auth')
    logout(@Request() req:any, @Next() next:NextFunction, @Res() res:Response){
        req.logOut(function(error:Error){
            if(error){
                return next(error);
            }
            res.json({
                message: "Successfully loged out",
            })
        });
        return {message:"Successfully loged out"}
    }
}