const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.js');

router.get('/', profileController.renderProfile);

router.put('/:id', profileController.updateProfile);

router.delete("/rm", profileController.removeProfilePicture)



module.exports = router;
