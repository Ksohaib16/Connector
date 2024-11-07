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

module.exports.delete = async (req, res)=>{
    try {
        let {conversationId} = req.query;

        if(conversationId){
        await prisma.message.deleteMany({where:{
            conversationId: conversationId
        }
        });
        return res.status(200).json({ message: "Messages deleted successfully" });
    }else{
            return res.status(400).json({message: "Conversation ID is required"});
        }
        
    } catch (error) {
        console.error(error);
    }
};

