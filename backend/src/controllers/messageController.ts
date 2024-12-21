import { RequestHandler } from "express";
import prisma from "../db/prisma";

export const createMessage: RequestHandler = async (req, res) => {
  const senderId = req.user?.uid;

  const { content, conversationId } = req.body;

  if (!content || !conversationId) {
    res
      .status(400)
      .json({ message: "content and conversationId are required" });
    return;
  }

  const newMessage = await prisma.message.create({
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
  });

  if (!newMessage) {
    res.status(500).json({ message: "Failed to create message" });
    return;
  }

  res.status(201).json({ message: "Message created", newMessage });
};

export const getAllMessages: RequestHandler = async (req, res) => {
  const conversationId = req.params.conversationId;

  if (!conversationId) {
    res.status(400).json({ message: "conversationId is required" });
    return;
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
    res.status(500).json({ message: "Failed to get messages" });
    return;
  }

  res.status(200).json({success:"All messages",messages });
};
