/*
  Warnings:

  - You are about to drop the column `lastMessage` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `lastMessageId` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Conversation_lastMessage_idx";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "lastMessage",
DROP COLUMN "lastMessageId",
ADD COLUMN     "lastMessageContent" TEXT,
ADD COLUMN     "lastMessageSenderId" TEXT,
ALTER COLUMN "lastMessageTime" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Conversation_updatedAt_id_idx" ON "Conversation"("updatedAt", "id");

-- CreateIndex
CREATE INDEX "Conversation_lastMessageTime_idx" ON "Conversation"("lastMessageTime");
