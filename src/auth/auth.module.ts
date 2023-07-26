import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './Auth.controller';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/util.service';


@Module({
  imports:[PassportModule.register({session:true})],
  providers: [AuthService,LocalStrategy,SessionSerializer,PrismaService,UtilService],
  controllers:[AuthController]
})
export class AuthModule {}
