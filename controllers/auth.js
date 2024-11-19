const prisma = require("../db/db");
require("dotenv").config();
const { userSchema, loginSchema } = require("../schemaValidation");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");
const ExpressError = require("../utils/ExpressError");

module.exports.renderSignup = (req, res) => {
  res.render("auth/signup.ejs", { message: null });
};

module.exports.signup = async (req, res, next) => {
  let { error } = userSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter valid information" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: "Email already exists",
    });
  }

  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

  const avatarUrl = "https://via.placeholder.com/150";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      avatarUrl,
    },
  });

  let userId = user.id;
  let token = jwt.sign({ userId }, JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 48 * 60 * 60 * 1000, // 72 hours
  });

  res.status(200).json({
    success: true,
    message: "Signup successful",
  });
};

module.exports.renderLogin = (req, res) => {
  res.render("auth/login.ejs", { message: null });
};

module.exports.login = async (req, res, next) => {
  let { error } = loginSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: "Please enter valid information" });
  }

  let inputPassword = req.body.password;

  async function verifyPassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  const isValidPassword = await verifyPassword(inputPassword, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ success: false, error: "Invalid password" });
    }

  if (user && isValidPassword ) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 48 * 60 * 60 * 1000, //72 hours
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }
};

module.exports.logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Failed to log out"
    })
  }
};

