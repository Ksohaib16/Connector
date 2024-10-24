const authMiddleware = require("../authMiddleware");
const prisma = require("../db/db");

module.exports.create = [authMiddleware,async (req, res) => {
    const senderId = req.userId;
    const {content, conversationId} = req.body;
    try{
        const newMessage = await prisma.message.create({
            data: {
                content,
                sender: {
                    connect: { id: senderId }, // Connects the message to the sender (the current user)
                },
                conversation: {
                    connect: { id: conversationId },  // Connects the message to an existing conversation
                },
            }
        });
        if(!newMessage){
            return res.status(400).json({message: "Failed to create message"});
        }
        return res.status(201).json(newMessage);
    }catch(err){
        res.status(500).send({message: err.message});
    }
  }];

  module.exports.getMessages = [authMiddleware, async (req, res) =>{
    const conversationId = req.query.conversationId;
    try{
        let messages =  await prisma.message.findMany({
            where:{
                conversationId,
            },
            include:{
                sender: true,
                conversation: true,
            },
        });
        if(!messages){
            return res.status(404).json({message: "No messages found"});
        }
            return res.status(200).json(messages);

    }catch(err){
        res.status(500).send({message: err.message});
    }

}]

// module.exports.displayMessage = [
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const currentUserId = req.userId; 
//       const { friendId } = req.query;

//       if (!friendId) {
//         return res.status(400).json({ error: 'Friend ID is required' });
//       }

//       const messages = await prisma.message.findMany({
//         where: {
//           OR: [
//             { AND: [{ senderId: currentUserId }, { receiverId: parseInt(friendId) }] },
//             { AND: [{ senderId: parseInt(friendId) }, { receiverId: currentUserId }] }
//           ]
//         },
//         orderBy: {
//           timestamp: 'asc'
//         },
//         select: {
//           id: true,
//           content: true,
//           senderId: true,
//           receiverId: true,
//           timestamp: true,
//           messageType: true
//         }
//       });

//       if (messages.length === 0) {
//         return res.status(200).json({ message: "No messages found between you and the selected friend." });
//       }
      

//       res.json({ messages: "Here are your messages", data: messages });

//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// ];

// module.exports.createMessage = async (req, res) => {
//   let { senderId, receiverId, content, messageType } = req.body;

//   // Convert senderId and receiverId to integers
//   senderId = parseInt(senderId);
//   receiverId = parseInt(receiverId);

//   // Validate that the conversion was successful
//   if (isNaN(senderId) || isNaN(receiverId)) {
//     return res.status(400).json({ error: 'Invalid sender or receiver ID' });
//   }

//   try {
//     console.log('Attempting to create message with data:', { senderId, receiverId, content, messageType });
    
//     const message = await prisma.message.create({
//       data: {
//         content,
//         messageType,
//         sender: { connect: { id: senderId } },
//         receiver: { connect: { id: receiverId } },
//       },
//       include: {
//         sender: true,
//         receiver: true,
//       },
//     });

//     console.log('Message created successfully:', message);
//     res.json({ message: "Message created", data: message });
//   } catch (error) {
//     console.error('Error creating message:', error);
//     console.error('Error details:', error.message);
//     if (error.code) {
//       console.error('Prisma error code:', error.code);
//     }
//     res.status(500).json({ error: 'Failed to create message', details: error.message });
//   }
// };