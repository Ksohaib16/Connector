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

// module.exports.search = async (req, res) => {
//   const { email } = req.query;
//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user) {
//     return res.json("User not found");
//   } else {
//     res.json(user);
//   }
// };

// module.exports.addFriend = [
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const currUser = await prisma.user.findUnique({
//         where: { id: req.userId },
//       });
//       if (!currUser) {
//         return res.status(404).json({ message: "Current user not found." });
//       }

//       const friendId = parseInt(req.body.friendId);
//       if (isNaN(friendId)) {
//         return res.status(400).json({ message: "Invalid friendId provided." });
//       }

//       // Check if friendship already exists in either direction
//       const existingFriendship = await prisma.friend.findFirst({
//         where: {
//           OR: [
//             { userId: currUser.id, friendId: friendId },
//             { userId: friendId, friendId: currUser.id }
//           ]
//         }
//       });

//       if (existingFriendship) {
//         return res.status(200).json({
//           message: "Friendship already exists",
//           friendship: existingFriendship,
//         });
//       }

//       // If friendship doesn't exist, create it in both directions
//       const newFriendship1 = await prisma.friend.create({
//         data: {
//           user: { connect: { id: currUser.id } },
//           friend: { connect: { id: friendId } },
//         },
//         include: {
//           friend: true,
//         },
//       });

//       const newFriendship2 = await prisma.friend.create({
//         data: {
//           user: { connect: { id: friendId } },
//           friend: { connect: { id: currUser.id } },
//         },
//         include: {
//           friend: true,
//         },
//       });

//       res.status(201).json({
//         message: "Friendship created successfully",
//         friendship: newFriendship1,
//       });
//     } catch (error) {
//       console.error("Error in addFriend:", error);
//       res.status(500).json({ message: "Internal server error.", error: error.message });
//     }
//   },
// ];

// module.exports.getFriends = async (req, res) => {
//   const { userId } = req.query;

//   try {
//     if (!userId) {
//       return res.status(400).json({ message: "Missing userId parameter." });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: parseInt(userId) },
//       include: {
//         friends: {
//           include: {
//             friend: true,
//           },
//         },
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     if (!user.friends || user.friends.length === 0) {
//       return res.status(200).json({ message: "No friends found.", friends: [] });
//     }

//     // Success response with friends list
//     res.status(200).json({
//       message: "Friends fetched successfully it is working",
//       friends: user.friends, // This will include the friends data
//     });
//   } catch (error) {
//     console.error("Error in getFriends:", error);
//     res.status(500).json({ message: "Internal server error.", error: error.message });
//   }
// };

// module.exports.deleteFriend = async  (req, res) => {
//   const {friendId} = req.query;

//   let removingFriend = await prisma.friend.findUnique({
//     where: {
//       id: parseInt(friendId)
//       }
//       });

//       if(!removingFriend){
//         res.status(404).json({message: "Friend does not exist"});
//       }

//   await prisma.friend.delete({
//     where: {
//       id: parseInt(friendId),
//     }
//   })
// }
