const express = require('express'); 
const router = express.Router();

const messageController = require("../controllers/message.js")

//create
router.route("/").post(messageController.create)

//getall
router.route("/messages").get(messageController.getMessages);

//delete
router.route("/delete").delete(messageController.delete);



module.exports = router;
