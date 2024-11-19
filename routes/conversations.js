const express = require('express'); 
const router = express.Router();

const conversationController = require("../controllers/conversations.js");
const wrapAsync = require("../utils/wrapAsync.js")

//get friend
router.get("/friend", conversationController.getFriend);

//create
router.post("/", conversationController.create);

// //get all
router.get("/", conversationController.getAll);

router.delete("/delete", wrapAsync(conversationController.delete))


module.exports = router;