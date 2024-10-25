require('dotenv').config();
const express = require("express");
const app = express();
const path =  require("path");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute.js");
const homeRoute = require("./routes/homeRoute.js")
const conversationsRoute = require("./routes/conversations.js")
const messageRoute = require("./routes/messageRoute.js")
const prisma = require("./db/db.js");



const http = require("http");
const { Server } = require("socket.io");



app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', './views');
app.use(cookieParser());

app.use(express.json());

const  server = http.createServer(app);
const io =  new Server(server);

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

app.get('/', (req, res) => {
    res.redirect('/api/auth/login');
});

const users = new Map();

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error: Missing token'));
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.userId = decoded.userId;
        if (!socket.userId) {
            return next(new Error('Authentication error: Invalid token payload'));
        }
        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        next(new Error('Authentication error: Invalid token'));
    }
});


io.on("connection",(socket) =>{
     console.log("a user connected");
     users.set(socket.userId, socket.id);

     socket.on("newMessage", async (message) => {
        try {
            const { conversationId, content, senderId } = message;
            
            // Get all members of the conversation (you'll need to implement this)
            const conversationMembers = await getConversationMembers(conversationId);
            
            // Send message to all members of the conversation except sender
            conversationMembers.forEach(memberId => {
                if (memberId !== senderId) {
                    const recipientSocketId = users.get(memberId);
                    if (recipientSocketId) {
                        io.to(recipientSocketId).emit("newMessage", {
                            conversationId,
                            content,
                            senderId
                        });
                    }
                }
            });
        } catch (error) {
            console.error("Error handling new message:", error);
        }
    })
})

async function getConversationMembers(conversationId) {
    try {
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                members: {
                    select: {
                        userId: true
                    }
                }
            }
        });
        
        return conversation.members.map(member => member.userId);
    } catch (error) {
        console.error("Error fetching conversation members:", error);
        return [];
    }
}


app.use("/api/auth", authRoute)
app.use("/api/home",  homeRoute);
app.use("/api/conversations",  conversationsRoute);
app.use("/api/message", messageRoute)


server.listen(3000, ()=>{
    console.log("server is running on port 3000")
});