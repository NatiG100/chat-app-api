-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INACTIVE', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'AUDIO', 'VIDEO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "profileImg" TEXT,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'INACTIVE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT NOT NULL,
    "profileImg" TEXT,
    "superAdminId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroup" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "bocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "AdminGroup" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "AdminGroup_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroupPermission" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "UserGroupPermission_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChat" (
    "userId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "UserChat_pkey" PRIMARY KEY ("userId","chatId")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "sender" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "video" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Group_link_key" ON "Group"("link");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_groupId_key" ON "Chat"("groupId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminGroup" ADD CONSTRAINT "AdminGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminGroup" ADD CONSTRAINT "AdminGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroupPermission" ADD CONSTRAINT "UserGroupPermission_userId_groupId_fkey" FOREIGN KEY ("userId", "groupId") REFERENCES "AdminGroup"("userId", "groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroupPermission" ADD CONSTRAINT "UserGroupPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChat" ADD CONSTRAINT "UserChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChat" ADD CONSTRAINT "UserChat_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_fkey" FOREIGN KEY ("sender") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
