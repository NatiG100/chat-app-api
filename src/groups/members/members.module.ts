import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [MembersController],
  providers: [MembersService,ConfigService]
})
export class MembersModule {}
