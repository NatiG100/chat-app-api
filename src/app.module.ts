import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {ConfigModule} from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [UsersModule,ConfigModule.forRoot({isGlobal:true}), AuthModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
