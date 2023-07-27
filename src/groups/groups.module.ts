import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/util.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService,PrismaService,UtilService]
})
export class GroupsModule {}
