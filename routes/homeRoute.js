const express = require('express'); 
const router = express.Router();

const homeController = require("../controllers/home.js")

router.route("/").get(homeController.renderHome)

// router.route("/search").get(homeController.search);

// router.route("/new").post(homeController.addFriend);

// router.route("/friends").get(homeController.getFriends);

// router.route("/deleteFriend").delete(homeController.deleteFriend);





module.exports = router;
