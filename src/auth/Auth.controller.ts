import { Body, Controller, Delete, Get, HttpException, HttpStatus, Next, Patch, Post, Redirect, Request, Res, UseFilters, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { ChangePasswordDto, LoginDto } from "./authDto";
import { AuthenticatedGuard } from "./authenticated.guard";
import { NextFunction, Response } from "express";

@Controller("auth")
export class AuthController{
    constructor(private readonly authService:AuthService){}
    @UseGuards(LocalAuthGuard)
    @Post()
    async login(@Body() body:LoginDto, @Request() req:any){
        return req.user;
    }

    @UseGuards(AuthenticatedGuard)
    @Get()
    whoAmI(@Request() req:any){
        return this.authService.me(req.user.id);
    }

    @UseGuards(AuthenticatedGuard)
    @Patch()
    async changePassword(@Request() req:any,@Body() changeDto:ChangePasswordDto){
        await this.authService.changePassword(req.user.id,changeDto)
        return {message:"Password successfully changed"}
    }
    
    @UseGuards(AuthenticatedGuard)
    @Delete()
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

    @UseGuards(AuthenticatedGuard)
    @Patch('activate')
    async activate(@Request() req:any){
        await this.authService.activate(req.user.id)
        return {message:"Your account has been activated"}
    }
}