import { RequestHandler } from "express";
import prisma from "../db/prisma";
import { searchFriendBody } from "../models/schemaValidation";
import { verifyToken } from "../firebase-config/firebaseConfig";

export const getFriend: RequestHandler = async (req, res) => {
  const result = searchFriendBody.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }
  const currUserEmail = req.user?.email;
  const { email } = result.data;

  if (email === currUserEmail) {
    res.status(400).json({ error: "You can't add yourself as a friend" });
    return;
  }

  const friend = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!friend) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(200).json({ friend });
  return;
};

export const createConversationAndMember: RequestHandler = async (req, res) => {
  const user = req.body;

  const currUserEmail = req.user?.email;
  const { email } = user;

  if (email === currUserEmail) {
    res.status(400).json({ error: "You can't add yourself as a friend" });
    return;
  }

  const newConversation = await prisma.conversation.create({
    data: {
      members: {
        create: [
          {
            user: {
              connect: { id: req.user?.uid },
            },
          },
          {
            user: {
              connect: { id: user.id },
            },
          },
        ],
      },
    },
  });
  res.status(200).json({ newConversation });
  return;
};

export const getAllConversation: RequestHandler = async (req, res) => {
  const currUser = req.user;
  const userConversation = await prisma.conversation.findMany({
    where: {
      members: {
        some: {
          userId: currUser?.uid,
        },
      },
    },
    include: {
      lastMessage: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  res.status(200).json({ userConversation });
};
