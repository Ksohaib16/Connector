import prisma from "../db/prisma";
import { verifyToken } from "../firebase-config/firebaseConfig";
import express, { Request, RequestHandler, Response } from "express";
import { loginBody, signupBody } from "../models/schemaValidation";

export const signup: RequestHandler = async (req, res) => {
  const firebaseUser = req.user;
  const result = signupBody.safeParse(req.body);
  if (!firebaseUser?.uid || !firebaseUser?.email) {
    throw new Error("Firebase user ID or email is undefined");
  }

  if (!result.success) {
    res.status(400).json({
      message: "Incorrect inputs",
      errors: result.error.errors,
    });
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: firebaseUser?.email,
    },
  });

  if (existingUser) {
    res.status(400).json({ message: "Email already exists" });
  }

  const user = await prisma.user.create({
    data: {
      id: firebaseUser?.uid,
      username: req.body.username,
      email: firebaseUser?.email,
      avatarUrl: req.body.avatarUrl,
    },
  });
  console.log("User created in DB:", user);
  res.status(200).json({
    message: "User created successfully",
    user,
  });
};

export const login: RequestHandler = async (req, res) => {
  const firebaseUser = req.user;
  if(!firebaseUser?.uid || !firebaseUser?.email) {
    throw new Error("Firebase user ID or email is undefined");
  }
  const result = loginBody.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: "Incorrect inputs",
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where:{
      email:firebaseUser?.email
    }
  });

  if(!user){
    res.status(400).json({message: "User not found" });
    return;
  }
  res.status(200).json({
    message: "User logged in successfully",
    user,
  })

};
