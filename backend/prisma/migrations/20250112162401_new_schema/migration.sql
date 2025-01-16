/*
  Warnings:

  - You are about to drop the column `lastMessageContent` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `lastMessageSenderId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `notification` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `lastMessage` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastMessageId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Made the column `lastMessageTime` on table `Conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Conversation_lastMessageTime_idx";

-- DropIndex
DROP INDEX "Conversation_updatedAt_id_idx";

-- DropIndex
DROP INDEX "ConversationMember_userId_conversationId_idx";

-- DropIndex
DROP INDEX "Message_conversationId_createdAt_idx";

-- DropIndex
DROP INDEX "Message_senderId_createdAt_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_status_idx";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "lastMessageContent",
DROP COLUMN "lastMessageSenderId",
DROP COLUMN "notification",
ADD COLUMN     "lastMessage" TEXT NOT NULL,
ADD COLUMN     "lastMessageId" TEXT NOT NULL,
ALTER COLUMN "lastMessageTime" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Conversation_lastMessage_idx" ON "Conversation"("lastMessage");

-- CreateIndex
CREATE INDEX "ConversationMember_userId_idx" ON "ConversationMember"("userId");

-- CreateIndex
CREATE INDEX "ConversationMember_conversationId_idx" ON "ConversationMember"("conversationId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");
