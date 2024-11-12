const prisma = require("../db/db");
require('dotenv').config();
const { userSchema, loginSchema } = require("../schemaValidation");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const ExpressError = require("../utils/ExpressError");


module.exports.renderSignup = (req, res) => {
  res.render("auth/signup.ejs", {message: null});
};

module.exports.signup = async (req, res, next) => {
  let { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (existingUser) {
    return res.status(400).render("auth/signup.ejs", { message: "Email already exists" });
  }

  const password = req.body.password;
  const username = req.body.username;
  const email = req.body.email;
  const avatarUrl = "https://via.placeholder.com/150";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      avatarUrl
      }
      });
      
  let userId = user.id;
  let token = jwt.sign({ userId }, JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 48 * 60 * 60 * 1000, // 72 hours
  });

  res.redirect("/api/home");
};

module.exports.renderLogin = (req, res) => {
  res.render("auth/login.ejs", {message: null});
};

module.exports.login = async (req, res, next) => {
  let { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
try {
  let inputPassword = req.body.password;

  async function verifyPassword (inputPassword,  hashedPassword) {
   return await bcrypt.compare(inputPassword, hashedPassword);
  };

  const user = await prisma.user.findUnique({
    where: { email: req.body.email},
  });

  if(user && await verifyPassword(inputPassword, user.password)){
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: false,
         secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
      maxAge: 48 * 60 * 60 * 1000, //72 hours
    });
  
    res.redirect("/api/home");
  }else{
    return res.status(401).render("auth/login.ejs",{message: "Invalid email or password" });
  }
 
} catch (error) {
  next(error)
}  
};
