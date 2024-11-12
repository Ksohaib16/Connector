const express = require('express'); 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const translateController = require("../controllers/translate.js");


router.post("/",wrapAsync(translateController.translate));
router.post("/quick",wrapAsync(translateController.translate));


module.exports = router;
