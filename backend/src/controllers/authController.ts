import prisma from "../db/prisma";
import { verifyToken } from "../firebase-config/firebaseConfig";
import express, { Request, RequestHandler, Response } from "express";
import { loginBody, signupBody } from "../models/schemaValidation";
import { WrapAsync } from "../utility/wrapAsync";
import { CustomError } from "../utility/CustomError";

export const signup: RequestHandler = WrapAsync(async (req, res) => {
  const firebaseUser = req.user;
  const result = signupBody.safeParse(req.body);
  if (!firebaseUser?.uid || !firebaseUser?.email) {
    throw new CustomError(401,"Session expired, please login");
  }

  if (!result.success) {
    throw new CustomError(400, "Incorrect inputs",{errors: result.error.errors});
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: firebaseUser?.email,
    },
  });

  if (existingUser) {
    throw new CustomError(400, "User already exists");
  }


  const user = await prisma.user.create({
    data: {
      id: firebaseUser?.uid,
      username: req.body.username,
      email: firebaseUser?.email,
      avatarUrl: req.body.avatarUrl,
    },
  });

  res.status(200).json({
    status: "success",
    data:{user}
  });
});

export const login: RequestHandler = WrapAsync( async (req, res) => {
  const firebaseUser = req.user;
  if(!firebaseUser?.uid || !firebaseUser?.email) {
    throw new CustomError(401,"Session expired, please login again");
  }
  const result = loginBody.safeParse(req.body);
  if (!result.success) {
    throw new CustomError(400, "Incorrect inputs",{errors: result.error.errors});
  }

  const user = await prisma.user.findUnique({
    where:{
      email:firebaseUser?.email
    }
  });

  if(!user){
    throw new CustomError(401,"User does not exist");
  }
  res.status(200).json({
    status: "success",
    data:{user}
  })

});
