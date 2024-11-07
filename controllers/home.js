const authMiddleware = require("../authMiddleware");
const prisma = require("../db/db");

module.exports.renderHome = [
  authMiddleware,
  async (req, res) => {
    const userId = req.userId;
    try{
      const user = await prisma.user.findUnique({ where: { id: userId } });

      res.render("home/home.ejs", {user});
    }catch(err){
      console.log(err);
    }

  },
];

