/*
  Warnings:

  - You are about to drop the column `lastMessageId` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_lastMessageId_fkey";

-- DropIndex
DROP INDEX "Conversation_lastMessageId_idx";

-- DropIndex
DROP INDEX "ConversationMember_conversationId_idx";

-- DropIndex
DROP INDEX "ConversationMember_userId_idx";

-- DropIndex
DROP INDEX "Message_conversationId_idx";

-- DropIndex
DROP INDEX "Message_senderId_idx";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "lastMessageId",
ADD COLUMN     "lastMessageContent" TEXT,
ADD COLUMN     "lastMessageSenderId" TEXT,
ADD COLUMN     "lastMessageTime" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Conversation_updatedAt_id_idx" ON "Conversation"("updatedAt", "id");

-- CreateIndex
CREATE INDEX "Conversation_lastMessageTime_idx" ON "Conversation"("lastMessageTime");

-- CreateIndex
CREATE INDEX "ConversationMember_userId_conversationId_idx" ON "ConversationMember"("userId", "conversationId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_createdAt_idx" ON "Message"("senderId", "createdAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");
