const authMiddleware = require("../authMiddleware");
const prisma = require("../db/db");

module.exports.getFriend = async (req, res) => {
  const email = req.query.email;

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      const user = await prisma.user.findUnique({
          where: { email: email }
      });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.create = [
  authMiddleware,
  async (req, res) => {
    const currentUserId = req.userId;
    const friendEmail = req.body.email;

    try {
      const friend = await prisma.user.findUnique({ where: { email: friendEmail } });

      if (!friend) {
        return res.status(404).json({ message: "Friend not found" });
      }

      const friendUserId = friend.id;

      if (friendUserId === currentUserId) {
        return res.status(400).json({ message: "You can't add yourself as a friend" });
      }

      const existingConversation = await prisma.conversation.findFirst({
        where: {
          members: {
            every: {
              userId: { in: [currentUserId, friendUserId] }
            }
          }
        }
      });

      if (existingConversation) {
        return res.status(200).json({ message: "Conversation already exists", conversation: existingConversation });
      }

      const newConversation = await prisma.conversation.create({
        data: {
          members: {
            create: [
              {
                user: {
                  connect: { id: currentUserId },
                },
              },
              {
                user: {
                  connect: { id: friendUserId },
                },
              },
            ],
          },
        },
      });

      res.status(200).json(newConversation);

    } catch (err) {
      console.error("Error creating conversation:", err);
      res.status(500).json({ message: "Error creating friend request", error: err.message });
    }
  },
];

module.exports.getAll = [authMiddleware, async(req, res) =>{
  const currentUserId = req.userId;
  try{
      const allConersations = await prisma.conversation.findMany({
        where:{
          members:{
            some:{
              userId: currentUserId,

            }
          }
        },
        include:{
          members: {
            include:{
              user:true
            }
          }
        }
      });
      res.status(200).json(allConersations);
  }catch(err){
    console.error("Error fetching conversations:", err);
  }
}];

module.exports.delete = [
  authMiddleware,
  async (req, res) => {
    const { conversationId } = req.body;
    const currentUserId = req.userId;

    try {
      await prisma.$transaction(async (prisma) => {
        // Check if the conversation exists and belongs to the current user
        const conversation = await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            members: {
              some: {
                userId: currentUserId,
              },
            },
          },
        });

        if (!conversation) {
          return res.status(404).json({
            success: false,
            message: "Conversation not found or you don't have permission to delete it"
          });
        }

        // Delete messages first
        await prisma.message.deleteMany({
          where: { conversationId }
        });

        // Delete conversation members
        await prisma.conversationMember.deleteMany({
          where: { conversationId }
        });

        // Delete the conversation itself
        await prisma.conversation.delete({
          where: { id: conversationId }
        });

        // Successful response
        res.status(200).json({
          success: true,
          message: "Conversation deleted successfully"
        });
      });
    } catch (err) {
      console.error("Error deleting conversation:", err);
      res.status(500).json({
        success: false,
        message: "Failed to delete conversation"
      });
    }
  },
];

