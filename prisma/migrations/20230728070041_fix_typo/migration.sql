/*
  Warnings:

  - You are about to drop the column `bocked` on the `UserGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserGroup" DROP COLUMN "bocked",
ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false;
