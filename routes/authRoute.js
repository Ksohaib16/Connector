const express = require('express'); 
const router = express.Router();

const authController = require("../controllers/auth.js")

router.route("/signup")
.get (authController.renderSignup)
.post(authController.signup)

router.route("/login")
.get(authController.renderLogin)
.post(authController.login)

module.exports = router;