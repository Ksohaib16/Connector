const express = require('express'); 
const router = express.Router();

const translateController = require("../controllers/translate.js")

router.post("/", translateController.translate)
router.post("/quick", translateController.quicktranslate)


module.exports = router;
