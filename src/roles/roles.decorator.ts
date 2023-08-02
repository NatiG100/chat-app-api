import { SetMetadata } from '@nestjs/common';
import { permissions } from 'src/types';

export const Roles = (permissionId: permissions) => SetMetadata('permissionId', permissionId);
