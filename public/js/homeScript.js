
// $(document).ready(() => {
//   const token = document.cookie.split("=")[1];
//   const socket = io({
//     auth: { token },
//   });

//   const currEmail = $("#currEmail").val();
//   const currentUserId = $("#currUserId").val(); 

//   const searchBtn = document.getElementById("searchButton");
//   const searchInput = document.getElementById("searchInput");
//   const friendList = document.getElementById("friendList");
//   const searchForm = document.getElementById("searchForm");
  
    // searchForm.addEventListener("submit", async (e) => {
    //   e.preventDefault();
  
    //   let email = searchInput.value;
  
    //   let result = await axios.get(
    //     `/api/home/search?email=${encodeURIComponent(email)}`
    //   );
  
    //   if (result.data && result.data.username) {
    //     if (result.data.email === "" || result.data.email === currEmail) {
    //       console.log("Please enter a valid email address"); //checker
    //     } else {
    //       // Display the search result and add friend button
    //       const searchResultHtml = `
    //         <div class="search-result">
    //           <span>${result.data.username}</span>
    //           <button class="addFriend btn btn-primary" data-friend-id="${result.data.id}">Add Friend</button>
    //         </div>
    //       `;
    //       $("#searchResult").html(searchResultHtml);
    //     }
    //   } else {
    //     $("#searchResult").html("<p>No user found with that email.</p>");
    //   }
    //   console.log(result.data);
    // });
  
//     $(document).on("click", ".addFriend", async function(e) {
//       e.preventDefault();
//       const friendId = $(this).data("friendId");
//       try {
//         let newFriendResult = await axios.post("/api/home/new", {
//           friendId: friendId,
//         });
//         console.log("new friend added:", newFriendResult);
        
//         // Refresh the friend list
//         await refreshFriendList();
        
//         // Clear the search result
//         $("#searchResult").empty();
//         $("#searchInput").val("");
//       } catch (error) {
//         console.error("Error adding friend:", error);
//       }
//     });
  
//     async function refreshFriendList() {
//       try {
//         const response = await axios.get('/api/home/friends');
//         const friends = response.data.friends;
        
//         $('#friendList').empty();
//         friends.forEach(friendship => {
//           const friendHtml = `
//             <div class="friend" id="friend-${friendship.friend.id}" data-friend-id="${friendship.friend.id}">
//               <div class="img"></div>
//               <span class="friendUsername">${friendship.friend.username}</span>
//               <button class="deleteFriend" data-friend-id="${friendship.friend.id}">Delete</button>
//             </div>
//           `;
//           $('#friendList').append(friendHtml);
//         });
//       } catch (error) {
//         console.error("Error refreshing friend list:", error);
//       }
//     }

//   async function fetchAndDisplayMessages(friendId) {
//     try {
//       console.log("Fetching messages for friend ID:", friendId);
//       const response = await axios.get(`/api/message/messages?friendId=${friendId}`);
//       const messages = response.data.data; 
  
//       console.log("Fetched messages:", messages);
  
//       $("#chatBox").empty();  // Clear the chat box
//       console.log("Cleared chat box");
  
//       // Append messages to the chat box
//       messages.forEach((message) => {
//         const isOwnMessage = message.senderId === currentUserId;
//         const messageHtml = `<p class="${isOwnMessage ? "user-message" : "friend-message"}">${message.content}</p>`;
//         $("#chatBox").append(messageHtml);
//       });
  
//       console.log("Appended all messages to chat box");
  
//       // Scroll to the bottom of the chat box to show the latest messages
//       $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
//       console.log("Scrolled to bottom of chat box");
  
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   }

//     async function deleteFriend(friendId) {
//       try {
//         await axios.delete(`/api/home/deleteFriend?friendId=${friendId}`);
//         // Remove the friend element from the DOM
//         $(`#friend-${friendId}`).remove();
//       } catch (err) {
//         console.error("Error deleting friend:", err);
//       }
//     }
  
//     $(document).on("click", ".deleteFriend", async function (e) {
//       e.preventDefault();
//       e.stopPropagation(); // Prevent triggering the openChat event
//       const friendId = $(this).data("friendId");
//       await deleteFriend(friendId);
//     });

//     $(document).on("click", ".friend", async function (e) {
//       if (!$(e.target).hasClass('deleteFriend')) {
//         e.preventDefault();
//         const friendUsername = $(this).find(".friendUsername").text();
//         const friendId = $(this).data("friendId");
        
//         currentChatFriendId = friendId;
    
//         $("#currentChatName").text(friendUsername);
  
//         // Fetching and display messages
//         await fetchAndDisplayMessages(friendId);
  
//         // Clear notification
//         $(this).removeClass('new-message-notification');
        
//         console.log("Cleared notifications for friend:", friendId);
//       }
//     });
  
//     function appendMessageToChat(data, isOwnMessage) {
//       const messageHtml = `<p class="${isOwnMessage ? "user-message" : "friend-message"}">${data.content}</p>`;
//       $("#chatBox").append(messageHtml);
//       $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
//     }
  
//     $("#chatForm").submit(async (e) => {
//       e.preventDefault();
//       const content = $("#messageInput").val().trim();
    
//       if (!currentChatFriendId || !content) {
//         console.error("No chat selected or empty message");
//         return;
//       }
    
//       try {
//         console.log("Sending message:", content);
    
//         // Sending msg to the server
//         const response = await axios.post("/api/message", {
//           senderId: currentUserId,
//           receiverId: currentChatFriendId,
//           content: content,
//           messageType: "TEXT",
//         });
    
//         // Emiting msg
//         socket.emit("newMessage", response.data);
    
//         $("#messageInput").val("");
    
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }
 
//     socket.on("newMessage", async (data) => {
//       console.log("New message received:", data);
      
//       if (data.senderId === currentChatFriendId || data.receiverId === currentUserId) {
//         const isOwnMessage = data.senderId === currentUserId;
//         appendMessageToChat(data, isOwnMessage);
//       } else {
//         // If the chat is not currently open, show a notification
//         const friendElement = $(`#friend-${data.senderId}`);
//         if (friendElement.length > 0) {
//           friendElement.addClass('new-message-notification');
//         }
//       }
//     });
  

//     });



// $("#chatForm").submit((e) => {
//   e.preventDefault();
//   const content = $("#messageInput").val().trim();


  
//   if (!content) {
//     alert("Please enter a message");
//     return; // Exit the function to avoid sending empty messages
//   }

//   try {
//     console.log("Sending message:", content);
//     socket.emit("newMsg", content);

//     $("#messageInput").val("");

//   } catch (err) {
//     console.error("Error sending message:", err);
//   }
// });

// // Socket Event Handler for New Message
// socket.on("newMsg", (data) => {
//   console.log("New message received:", data);
  
//   // Construct message bubble based on received data
//   let receivedMessageBubble = `<div><span>${data}</span></div>`;
//   $("#chatBox").append(receivedMessageBubble);
// });

// });


// let conversations = [];
// let currUserId =  $("#currUserId").val();
// let currConversation = null;
// let messages = [];




// async function fetchConversations (){
//     try{
//         const response =  await axios.get("/api/conversations");
//         conversations = response.data
//         displayConversations();
//     }catch(err){
//         console.error(err);
//     }
// }

// async function displayConversations() {
//     $("#friendList").empty();
//     for(let c of conversations) {
//         for(let member of c.members) {
//             if (String(member.user.id) !== String(currUserId)) {
//                 const conversation = `<div class="friend" data-conversation-id="${member.conversationId}">
//                                         <div class="img"></div>
//                                         <span>${member.user.username}</span>
//                                       </div>`;
//                 $("#friendList").append(conversation);
//             }
//         }
//     }

// };
// $("#friendList").on("click", ".friend", async function() {
//     console.log("Clicked Element:", this); // Log the clicked element
//     const conversationId = $(this).data("conversation-id");
//     console.log("Conversation ID:", conversationId); 
//     await selectConversation(conversationId);
// });

// async function initialChatWindow(currConversation) {
//     if(currConversation ==  null) {
//         let chatWindow = `<div class="noConversation col-12 col-md-8"><span>Open a conversation to start chat</span></div>`
//         $("#chatMain").append(chatWindow);
//     }
    
// }

// async function selectConversation(conversationId){
//     currConversation = conversationId;
//     await  fetchMessages(currConversation);

// }

// async function fetchMessages (currConversation){
//     try{
//         let  response = await axios.get(`/api/message/messages?conversationId=${currConversation}`)
//         let messages = response.data;
//         await displayMessages(messages);
//     }catch(err){
//         console.error(err);
//     }
// }

// async function displayMessages(messages){
//     $("#chatMain").empty();

//     for(let  message of messages) {
//         const userMessage = message.senderId ===  currUserId;

//         let chatWindow = `<div class="chat-header">
//                 <h3 id="currentChatName">Friend Name</h3>
//             </div>
//             <div class="chat-box border p-3 mb-3" style="height: 200px; overflow-y: auto;" id="chatBox">
//                 <div class="${userMessage ? "user-message" : "other-message"}">${message.content}</div>
//             </div>
//             <div class="chat-input">
//                 <form id="chatForm">
//                     <div class="input-group">
//                         <input type="text" id="messageInput" class="form-control" placeholder="Type a message...">
//                         <button class="btn btn-primary" type="submit"><i class="fas fa-paper-plane"></i></button>
//                     </div>
//                 </form>
//             </div>`

//             $("#chatMain").append(chatWindow);
//     }

// }


// async function initChat() {
//     await fetchConversations();
//     await initialChatWindow(currConversation);
//   }

//   window.onload = initChat;

// Chat functionality



const ChatManager = {
    currentUserId: null,
    currentChatId: null,
    selectedConversationUserName: null,
    conversations: [],
    messages: [],
    socket: null,

    // setup function, this will run when page load
    start() {
        this.currentUserId = document.getElementById('currUserId').value;
        this.attachEventListeners();
        this.fetchConversations();
        this.initialChatWindow();
        this.intializeSocket();
    },

    intializeSocket(){
        const token = document.cookie.split("=")[1];
        this.socket = io({
            auth : { token}
        })

        // Socket event listeners
        this.socket.on("newMessage", (data) => {
            this.handleIncomingMessage(data);
        });

        // this.socket.on("userTyping", (data) => {
        //     this.handleUserTyping(data);
        // });

        // this.socket.on("userStopTyping", (data) => {
        //     this.handleUserStopTyping(data);
        // });
    },

    async handleIncomingMessage(data) {
        const { conversationId, content, senderId } = data;
        
        // If message is for current chat, append it
        if (conversationId === this.currentChatId) {
            const messageHTML = `
                <div class="message ${senderId === this.currentUserId ? 'user-message' : 'other-message'}">
                    ${content}
                </div>
            `;
            const messageContainer = document.getElementById('messageContainer');
            messageContainer.insertAdjacentHTML('beforeend', messageHTML);
            this.scrollToBottom();
        } else {
            // Show notification for other conversations
            this.showMessageNotification(conversationId);
        }
    },

    showMessageNotification(conversationId) {
        // Find the conversation element
        const conversationElement = document.querySelector(`.friend[data-conversation-id="${conversationId}"]`);
        if (conversationElement) {
            // Add notification indicator
            if (!conversationElement.querySelector('.notification-badge')) {
                const badge = document.createElement('div');
                badge.className = 'notification-badge';
                badge.innerHTML = '•';
                conversationElement.appendChild(badge);
            }
            
            // Add notification class for styling
            conversationElement.classList.add('has-notification');
        }
    },


    attachEventListeners() {
        document.getElementById('chatMain')?.addEventListener('submit', (e) => {
            if (e.target.id === 'messageForm') {
                e.preventDefault();
                this.handleMessageSubmit(e);
            }
        });
            document.getElementById("createConversationForm")?.addEventListener("submit", (e) => this.createConversation(e));
            document.getElementById('friendList')?.addEventListener('click', (e) => {
            if (e.target.closest('.friend')) {
                const conversationId = e.target.closest('.friend').dataset.conversationId;
                const conversationUsername = e.target.closest('.friend').dataset.conversationUsername;
                this.selectConversation(conversationId, conversationUsername);

            }
        });
    },

    async fetchConversations() {
        try {
            const response = await axios.get("/api/conversations");
            this.conversations = response.data;
            this.displayConversations();
        } catch (err) {
            console.error('Error fetching conversations:', err);
        }
    },

    displayConversations() {
        const friendList = document.getElementById('friendList');
        friendList.innerHTML = '';
        for (let conversation of this.conversations) {
            for (let member of conversation.members) {
                if (String(member.user.id) !== String(this.currentUserId)) {
                    const conversationHTML = `
                        <div class="friend" data-conversation-username="${member.user.username}" data-conversation-id="${member.conversationId}">
                            <div class="img"></div>
                            <span class="friendUserName">${member.user.username}</span>
                        </div>`;
                    friendList.insertAdjacentHTML('beforeend', conversationHTML);
                }
            }
        }
    },


    async selectConversation(conversationId, conversationUsername) {
        // Remove notification when conversation is selected
        const conversationElement = document.querySelector(`.friend[data-conversation-id="${conversationId}"]`);
        if (conversationElement) {
            conversationElement.classList.remove('has-notification');
            const badge = conversationElement.querySelector('.notification-badge');
            if (badge) badge.remove();
        }

        this.currentChatId = conversationId;
        this.selectedConversationUserName = conversationUsername;
        await this.fetchMessages(conversationId);
    },

    async fetchMessages(conversationId) {
        try {
            const response = await axios.get(`/api/message/messages?conversationId=${conversationId}`);
            this.messages = response.data;
            await this.displayMessages(this.messages);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    },

    initialChatWindow() {
        if (!this.currentChatId) {
            const chatMain = document.getElementById('chatMain');
            chatMain.innerHTML = `
                <div class="noConversation col-12 col-md-8">
                    <span>Open a conversation to start chat</span>
                </div>`;
        }
    },

    async displayMessages(messages) {
        const chatMain = document.getElementById('chatMain');
        chatMain.innerHTML = this.generateChatHTML(messages);
        this.scrollToBottom();
    },

    generateChatHTML(messages) {
        return `
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="img"></div>
                    <h3 id="currentChatName">${this.selectedConversationUserName}</h3>
                </div>
            </div>
            <div class="chat-box" id="messageContainer">
                ${this.generateMessagesHTML(messages)}
            </div>
            <div class="chat-input">
                <form id="messageForm">
                    <input type="text" id="messageInput" placeholder="Type your message..." autocomplete="off">
                    <button type="submit">
                        <i class="fas fa-paper-plane"></i>
                        Send
                    </button>
                </form>
            </div>
        `;
    },

    generateMessagesHTML(messages) {
        return messages.map(msg => {
            const senderId = String(msg.senderId);
            const currentUserId = String(this.currentUserId);
            return `
                <div class="message ${senderId === currentUserId ? 'user-message' : 'other-message'}">
                    ${msg.content}
                </div>
            `;
        }).join('');
    },

    scrollToBottom() {
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.scrollTop = messageContainer.scrollHeight;
    },

    async createConversation(e) {
        e.preventDefault();
        const searchContainer = document.getElementById("searchResult");
        const inputEmail = document.getElementById('searchInput').value;
    
        searchContainer.innerHTML = ''; 
    
        let friend = await this.getFriend(inputEmail);
        if (friend) {
            const resultHtml = `<div class="searchResult">${friend.username}</div> <button class="addFriendBtn btn btn-primary btn-sm">Add Friend </button>`;
            searchContainer.innerHTML = resultHtml; 

            const addBtn = document.querySelector(".addFriendBtn");
            addBtn.addEventListener("click", () => this.addFriend(inputEmail));
            
        } else {
            searchContainer.innerHTML = '<div class="searchResult">Friend not found</div>'; // Show a not found message
            console.log("Friend not found");
        }
    },

    async getFriend(inputEmail){
        try {
            const response = await axios.get("/api/conversations/friend",{
                params: { email: inputEmail }
            })
            return response.data;

        } catch (error) {
             console.error(error);
        }
    },

    async addFriend(inputEmail){
        try {
            let response  = await axios.post("/api/conversations/",{
                email: inputEmail
            });
            // Clear search results after successful add
            document.getElementById("searchResult").innerHTML = '';
            document.getElementById('searchInput').value = '';
            
            // Refresh the conversations list immediately
            await this.fetchConversations();

        } catch (error) {
            console.error(error);
        }

    },

    async handleMessageSubmit(event) {
        event.preventDefault();
        const messageInput = event.target.querySelector('#messageInput');
        const content = messageInput.value.trim();
        
        if (!content || !this.currentChatId) {
            return;
        }

        try {
            const response = await this.addMessage(content);
            if (response) {
                messageInput.value = '';
                // Optionally refresh messages to ensure consistency
                await this.fetchMessages(this.currentChatId);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    },

    async addMessage(content) {
        try {
            const response = await axios.post("/api/message", {
                content,
                senderId: this.currentUserId,
                conversationId: this.currentChatId
            });

            if (response.data) {
                let  message = response.data.content;

                // Emit new message event
                this.socket.emit("newMessage", {
                    conversationId: this.currentChatId,
                    content: message,
                    senderId: this.currentUserId
                });
                return response.data;
            }
            return null;
        } catch (err) {
            console.error("Error sending message:", err);
        }
    }
};

// Initialize chat on load
document.addEventListener('DOMContentLoaded', () => ChatManager.start());
