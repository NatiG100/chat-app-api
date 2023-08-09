import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport"

@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){
    async canActivate(context:ExecutionContext){
        try{
            const request = context.switchToHttp().getRequest();
            if(request.isAuthenticated()){
                throw new ForbiddenException("You have already loged in")
            }
            const result = (await super.canActivate(context)) as boolean;
    
            await super.logIn(request);
            return result;
        }catch(err){
            if(err.message==="Unauthorized"){
                throw new UnauthorizedException("Incorrect credentials")
            }
            throw err
        }
    }
}