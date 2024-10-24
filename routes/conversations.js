const express = require('express'); 
const router = express.Router();

const conversationController = require("../controllers/conversations.js");

//get friend
router.get("/friend", conversationController.getFriend);

//create
router.post("/", conversationController.create);

// //get all
router.get("/", conversationController.getAll);


module.exports = router;