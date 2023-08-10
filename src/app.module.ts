import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {ConfigModule} from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilModule } from './util/util.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UsersModule,ConfigModule.forRoot({isGlobal:true}), AuthModule, GroupsModule, PrismaModule, UtilModule, MessageModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
