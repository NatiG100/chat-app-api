import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './Auth.controller';


@Module({
  imports:[PassportModule.register({session:true})],
  providers: [AuthService,LocalStrategy,SessionSerializer],
  controllers:[AuthController],
})
export class AuthModule {}
