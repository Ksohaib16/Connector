import { RequestHandler } from "express";
import prisma from "../db/prisma";
import { CustomError } from "../utility/CustomError";

export const createMessage: RequestHandler = async (req, res) => {
  const senderId = req.user?.uid;

  const { content, conversationId } = req.body;

  if (!content || !conversationId) {
    throw new CustomError(400, "content and conversationId are required");
  }
  const [newMessage, updatedConversation] = await prisma.$transaction([
    prisma.message.create({
      data: {
        content,
        sender: {
          connect: {
            id: senderId,
          },
        },
        conversation: {
          connect: {
            id: conversationId,
          },
        },
      },
    }),

    prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageContent: content,
        lastMessageSenderId: senderId,
        lastMessageTime: new Date(),
      },
      include: {
        members: {
          select: {
            user: true,
          },
        },
      },
    }),
  ]);

  if (!newMessage) {
    throw new CustomError(500, "Failed to create message");
  }

  res.status(201).json({
    status: "success",
    message: "Message sent",
    data: { newMessage, updatedConversation },
  });
};

export const getAllMessages: RequestHandler = async (req, res) => {
  const conversationId = req.params.conversationId;

  if (!conversationId) {
    throw new CustomError(400, "conversationId is required");
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },

    include: {
      sender: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!messages) {
    throw new CustomError(404, "No messages found");
  }

  res.status(200).json({
    status: "success",
    data: { messages },
  });
};
