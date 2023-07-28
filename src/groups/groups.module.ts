import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MembersModule } from './members/members.module';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [MembersModule]
})
export class GroupsModule {}
