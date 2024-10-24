const prisma = require("../db/db");
const { userSchema, loginSchema } = require("../schemaValidation");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports.renderSignup = (req, res) => {
  res.render("auth/signup.ejs");
};

module.exports.signup = async (req, res) => {
  let { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (existingUser) {
    return res.status(400).send("Email already exists");
  }
  let user = await prisma.user.create({
    data: req.body
});
  let userId = user.id;
  let token = jwt.sign({ userId }, JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: false,
    maxAge: 72 * 60 * 60 * 1000, // 72 hours
  });

  res.redirect("/api/home");
};

module.exports.renderLogin = (req, res) => {
  res.render("auth/login.ejs");
};

module.exports.login = async (req, res) => {
  let { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = await prisma.user.findUnique({
    where: { email: req.body.email, password: req.body.password },
  });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  res.cookie("token", token, {
    httpOnly: false,
    maxAge: 30 * 24 * 60 * 60 * 1000, //72 hours
  });

  res.redirect("/api/home");
};
