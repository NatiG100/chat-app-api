/*
  Warnings:

  - You are about to drop the `UserChat` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user1Id` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Id` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserChat" DROP CONSTRAINT "UserChat_chatId_fkey";

-- DropForeignKey
ALTER TABLE "UserChat" DROP CONSTRAINT "UserChat_userId_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "user1Id" INTEGER NOT NULL,
ADD COLUMN     "user2Id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserChat";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
