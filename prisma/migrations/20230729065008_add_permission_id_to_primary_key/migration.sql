/*
  Warnings:

  - The primary key for the `UserGroupPermission` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UserGroupPermission" DROP CONSTRAINT "UserGroupPermission_pkey",
ADD CONSTRAINT "UserGroupPermission_pkey" PRIMARY KEY ("userId", "groupId", "permissionId");
