const prisma = require('../db/db');
const { userSchema, loginSchema } = require('../schemaValidation');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = require('../authMiddleware');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage }); // upload images to uploads folder

module.exports.renderProfile = [
   authMiddleware,
   async (req, res) => {
      const id = req.userId;
      const user = await prisma.user.findUnique({
         where: { id }
      });
      res.render('user/profile.ejs', { user });
   }
];

module.exports.updateProfile = [
   authMiddleware,
   upload.single('avatar'),
   async (req, res) => {
      const id = req.userId;
      const { username, email } = req.body;

      const updateData = {
         ...(username && { username }),
         ...(email && { email }),
      };

      if(req.file){
          updateData.avatarUrl = req.file.secure_url;
      }
      await prisma.user.update({
         where: { id },
         data: updateData
      });

      res.redirect("/api/home")
   }
];

module.exports.removeProfilePicture = [authMiddleware, async(req, res) =>{
   const id = req.userId;
   await prisma.user.update({
      where: {id},
      data: {avatarUrl: null}
   });

   res.status(200).json({message: "success handling  remove profile picture"});

}];
