import { RequestHandler } from "express";
import prisma from "../db/prisma";
import { searchFriendBody } from "../models/schemaValidation";
import { WrapAsync } from "../utility/wrapAsync";
import { CustomError } from "../utility/CustomError";

export const getFriend: RequestHandler = WrapAsync(async (req, res) => {
  const result = searchFriendBody.safeParse(req.body);
  if (!result.success) {
    throw new CustomError(401, "Invalid request body");
  }
  const currUserEmail = req.user?.email;
  const { email } = result.data;

  if (email === currUserEmail) {
    res
      .status(400)
      .json({ status: "fail", message: "You can't add yourself as a friend" });
    return;
  }

  const friend = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!friend) {
    throw new CustomError(404, "Friend not found");
  }

  res
    .status(200)
    .json({
      status: "success",
      message: "Friend found successfuly",
      data: { friend },
    });
  return;
});

export const createConversationAndMember: RequestHandler = WrapAsync(
  async (req, res) => {
    const { id, email } = req.body;

    if (!id || !email) {
      throw new CustomError(400, "Email is required");
    }

    const currUserId = req.user?.uid;
    const currUserEmail = req.user?.email;

    if (email === currUserEmail) {
      throw new CustomError(400, "You can't add yourself as a friend");
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        members: {
          every: {
            userId: {
              in: [currUserId, id],
            },
          },
        },
      },
    });

    if (existingConversation) {
      throw new CustomError(400, "Conversation already exists");
    }

    const newConversation = await prisma.conversation.create({
      data: {
        members: {
          create: [
            {
              user: {
                connect: { id: currUserId },
              },
            },
            {
              user: {
                connect: { id },
              },
            },
          ],
        },
      },
    });

    if (!newConversation) {
      throw new CustomError(400, "Failed to create conversation");
    }

    res.status(200).json({
      status: "success",
      message: "conversation created and members added",
      data: { newConversation },
    });
    return;
  }
);

export const getAllConversation: RequestHandler = WrapAsync(
  async (req, res) => {
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
        members: {
          select: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "All conversation fetched",
      data: { userConversation },
    });
  }
);
