const ChatManager = {
   currentUserId: null,
   currentChatId: null,
   selectedConversationUserName: null,
   selectedConversationUserAvatar: null,
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

   intializeSocket() {
      const token = document.cookie.split('=')[1];
      this.socket = io({
         auth: { token }
      });

      this.socket.on('connect', () => {
         console.log('Socket connected:', this.socket.id); // Ensure the client is connected
      });

      this.socket.on('newMessage', data => {
         this.handleIncomingMessage(data);
      });
   },

   async handleIncomingMessage(data) {
      const { conversationId, time, content, senderId, messageId } = data;

      // If message is for current chat, append it
      if (conversationId === this.currentChatId) {
         const messageHTML = this.MessageHTML(content, senderId, time, messageId);
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
      const conversationElement = document.querySelector(
         `.friend[data-conversation-id="${conversationId}"]`
      );
      if (conversationElement) {
         // Add notification indicator
         if (!conversationElement.querySelector('.notification-badge')) {
            const badge = document.createElement('div');
            badge.className = 'notification-badge';
            badge.innerHTML = 'Message';
            conversationElement.appendChild(badge);
         }

         // Add notification class for styling
         conversationElement.classList.add('has-notification');
      }
   },

   attachEventListeners() {
      document.getElementById('profileSetting')?.addEventListener('click', () => {
         this.openProfileSetting();
      });

      document.querySelector('.profile-close-overlay').addEventListener('click', () => {
         console.log('close button clicked');
         this.closeProfileSetting();
      });

      document.getElementById('chatMain')?.addEventListener('submit', e => {
         if (e.target.id === 'messageForm') {
            e.preventDefault();
            const clickedButton = e.submitter;

            if (clickedButton.value === 'send') {
               this.handleMessageSubmit(e);
            } else if (clickedButton.value === 'translate') {
               console.log('translate button clicked');
               this.handleTranslateButton(e);
            }
         }
      });

      // chat setting listener
      document.getElementById('chatMain').addEventListener('click', e => {
         if (
            e.target.id === 'chatSetting' ||
            (e.target.closest('#chatSetting') && e.target.tagName === 'I')
         ) {
            this.toggleChatSetting();

            //quick translate
         } else if (e.target.id === 'quickTranslate') {
            console.log(e.target.id, 'quick translaion event');
            const content = e.target.dataset.content;
            const messageId = e.target.dataset.id;
            const messageDiv = e.target.closest('.message');
            this.quickTranslate(content, messageId, messageDiv);
         }
      });

      document.querySelector('.close-overlay').addEventListener('click', () => {
         console.log('close button clicked');
         this.closeOverlaySetting();
      });

      document
         .getElementById('createConversationForm')
         ?.addEventListener('submit', e => this.createConversation(e));

      document.getElementById('friendList')?.addEventListener('click', e => {
         if (e.target.closest('.friend')) {
            const conversationId = e.target.closest('.friend').dataset.conversationId;

            if (this.currentChatId === conversationId) {
               let selectedDiv = document.querySelector(`[data-conversation="${conversationId}"]`);
               if (selectedDiv) {
                  selectedDiv.style.pointerEvents = 'none';
               }
            } else {
               const conversationUsername =
                  e.target.closest('.friend').dataset.conversationUsername;
               const conversationUserAvatar =
                  e.target.closest('.friend').dataset.conversationAvatar;
               this.selectConversation(
                  conversationId,
                  conversationUsername,
                  conversationUserAvatar
               );
            }
         }
      });

      // saving language setting
      document.querySelector('#settingsModal').addEventListener('click', e => {
         if (e.target.id === 'saveSelections') {
            this.saveLanguageSelections();
            popupManager.hideTranslationSetting();
            popupManager.showStatus('Language settings saved successfully!');
         }
      });

      window.addEventListener('click', e => {
         if (
            e.target.id === 'chatSetting' ||
            (!e.target.closest('#slideOverlay') && !e.target.closest('#chatSetting'))
         ) {
            this.closeOverlaySetting();
         }
         if (
            e.target.id === 'profileSetting' ||
            (!e.target.closest('#profileOverlay') && !e.target.closest('#profileSetting'))
         ) {
            this.closeProfileSetting();
         }
      });
   },

   saveLanguageSelections() {
      let conversationId = this.currentChatId;

      const yourLanguage = document.getElementById('userChoice').value;
      const translateTo = document.getElementById('targetLanguage').value;

      const key = `currConversation${conversationId}`;

      localStorage.setItem(
         key,
         JSON.stringify({ userChoice: yourLanguage, targetLanguage: translateTo })
      );
   },

   getLanguageSelections(conversationId) {
      const key = `currConversation${conversationId}`;
      const storedLanguageSelections = localStorage.getItem(key);
      if (storedLanguageSelections) {
         const languageSelections = JSON.parse(storedLanguageSelections);
         return languageSelections;
      }
   },

   loadLanguageSelections() {
      const conversationId = this.currentChatId;
      const languageSelections = this.getLanguageSelections(conversationId);
      if (languageSelections) {
         document.getElementById('userChoice').value = languageSelections.userChoice;
         document.getElementById('targetLanguage').value = languageSelections.targetLanguage;
      }
   },

   async fetchConversations() {
      const sidebar = document.querySelector('.chat-sidebar');
      try {
         LoaderUtil.showLoader(sidebar);
         const response = await axios.get('/api/conversations');
         this.conversations = response.data;
         this.displayConversations();
      } catch (err) {
         console.error('Error fetching conversations:', err);
         // Display an error message to the user or handle the error in a more graceful way
         const errorMessage = 'Failed to fetch conversations. Please try again later.';
         this.displayError(errorMessage);
      } finally {
         LoaderUtil.hideLoader(sidebar);
      }
   },

   displayConversations() {
      const friendList = document.getElementById('friendList');
      friendList.innerHTML = '';
      for (let conversation of this.conversations) {
         for (let member of conversation.members) {
            if (String(member.user.id) !== String(this.currentUserId)) {
               let avatarUrl = String(member.user.avatarUrl);
               const conversationHTML = `
                        <div class="friend" data-conversation-avatar="${avatarUrl}" data-conversation-username="${member.user.username}" data-conversation-id="${member.conversationId}">
                              <img class="friendProfilePicture" src="${avatarUrl}"  alt="avatar"></img>
                            <span class="friendUserName">${member.user.username}</span>
                        </div>`;
               friendList.insertAdjacentHTML('beforeend', conversationHTML);
            }
         }
      }
   },

   async selectConversation(conversationId, conversationUsername, conversationUserAvatar) {
      const chatMain = document.getElementById('chatMain');
      try {
         LoaderUtil.showLoader(chatMain);

         // Remove notification when conversation is selected
         const conversationElement = document.querySelector(
            `.friend[data-conversation-id="${conversationId}"]`
         );
         if (conversationElement) {
            conversationElement.classList.remove('has-notification');
            const badge = conversationElement.querySelector('.notification-badge');
            if (badge) badge.remove();
         }

         this.currentChatId = conversationId;
         this.selectedConversationUserName = conversationUsername;
         this.selectedConversationUserAvatar = conversationUserAvatar;
         await this.fetchMessages(conversationId);
      } catch (err) {
         console.error('Error selecting conversation:', err);
      } finally {
         LoaderUtil.hideLoader(chatMain);
      }
   },

   MessageHTML(content, senderId, time, messageId = null) {
      const isCurrentUser = String(senderId) === String(this.currentUserId);

      return `
         <div class="message ${isCurrentUser ? 'user-message' : 'other-message'}">
            <div id="${messageId}" class="messageContent">${content}</div>
            <div class="messageFeature">
               ${
                  !isCurrentUser
                     ? `<span data-id="${messageId}" data-content="${content}" id="quickTranslate" class="quickTranslate">
                     <i class="fa-solid fa-repeat"></i>translate
                   </span>`
                     : ''
               }
               <span class="time">${time}</span>
            </div>
         </div>
      `;
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

   async clearChatHistory() {
      try {
         const conversationId = this.currentChatId;
         if (!conversationId) {
            console.error('No conversation ID found');
            return;
         }

         const response = await axios.delete(
            `/api/message/delete?conversationId=${conversationId}`
         );
         console.log('Delete response:', response);

         if (response.status === 200) {
            await this.fetchMessages(conversationId);
         }
      } catch (error) {
         console.error('Error deleting messages:', error);
         // Handle error appropriately (show user message, etc.)
      } finally {
         popupManager.showStatus('Chat history cleared!');
      }
   },

   generateChatHTML(messages) {
      const avatarUrl = this.selectedConversationUserAvatar;
      return `
            <div class="chat-header" id="chatHeader">
                <div class="chat-header-info">
                <div class="user-info" >
                <img src="${avatarUrl}" class="friendProfilePicture"></img>
                        <h3 id="currentChatName">${this.selectedConversationUserName}</h3>
                        <div class="status"></div>
                    </div>
                <div class="chat-setting" id="chatSetting"> <i class="fa-solid fa-ellipsis-vertical"></i> </div>
                </div>
            </div>
            <div class="chat-box" id="messageContainer">
                ${this.generateMessagesHTML(messages)}
            </div>
            <div class="chat-input">
                <form id="messageForm">
                    <input type="text" id="messageInput" placeholder="Type your message..." autocomplete="off">

                    <button type="submit" name="action" value="send" class="btn btn-sm btn-dark send-btn">
                        <i class="fas fa-paper-plane"></i>
                        Send
                    </button>

                    <button type="submit" name="action" value="translate" class="btn btn-sm btn-dark send-btn>
                        <i class="fa-solid fa-repeat"></i>
                        Translate
                    </button>


                </form>
            </div>
        `;
   },

   generateMessagesHTML(messages) {
      return messages
         .map(msg => {
            const isTime = new Date(msg.timestamp).toLocaleString('en-IN', {
               timeZone: 'Asia/Kolkata',
               hour12: true,
               hour: '2-digit',
               minute: '2-digit'
            });

            return this.MessageHTML(msg.content, msg.senderId, isTime, msg.id);
         })
         .join('');
   },

   scrollToBottom() {
      const messageContainer = document.getElementById('messageContainer');
      messageContainer.scrollTop = messageContainer.scrollHeight;
   },

   async createConversation(e) {
      e.preventDefault();
      const searchContainer = document.getElementById('searchResult');
      const inputEmail = document.getElementById('searchInput').value;

      searchContainer.innerHTML = '';

      let friend = await this.getFriend(inputEmail);
      if (friend) {
         const resultHtml = `<div class="searchResult">${friend.username}</div> <button class="addFriendBtn btn btn-primary btn-sm">Add Friend </button>`;
         searchContainer.innerHTML = resultHtml;

         const addBtn = document.querySelector('.addFriendBtn');
         addBtn.addEventListener('click', () => this.addFriend(inputEmail));
      } else {
         searchContainer.innerHTML = '<div class="searchResult">Friend not found</div>'; // Show a not found message
         console.log('Friend not found');
      }
   },

   async getFriend(inputEmail) {
      try {
         const response = await axios.get('/api/conversations/friend', {
            params: { email: inputEmail }
         });
         return response.data;
      } catch (error) {
         console.error(error);
      }
   },

   async addFriend(inputEmail) {
      try {
         let response = await axios.post('/api/conversations/', {
            email: inputEmail
         });
         // Clear search results after successful add
         document.getElementById('searchResult').innerHTML = '';
         document.getElementById('searchInput').value = '';

         // Refresh the conversations list immediately
         await this.fetchConversations();
      } catch (error) {
         console.error(error);
      }
   },

   async handleMessageSubmit(event) {
      event.preventDefault();
      const messageBtn = event.target.querySelector('button[value="send"]');
      const messageInput = event.target.querySelector('#messageInput');
      const content = messageInput.value.trim();

      if (!content || !this.currentChatId) {
         return;
      }

      try {
         LoaderUtil.showButtonLoader(messageBtn);
         const response = await this.addMessage(content);
         if (response) {
            messageInput.value = '';
         }
      } catch (error) {
         console.error('Error sending message:', error);
      } finally {
         LoaderUtil.hideButtonLoader(messageBtn);
      }
   }, 
  
      // Click handler for translate button
      async quickTranslate(content, messageId, messageDiv) {
         const messageElement = document.getElementById(`${messageId}`);
         const quickTranslateElement = messageDiv.querySelector('.quickTranslate');
         const messageContentWrapper = messageElement?.parentElement;
         
         if (!messageElement) {
             console.error('Element not found:', messageId);
             return;
         }
     
         // Function to get translation from localStorage
         const getStoredTranslation = () => {
             try {
                 const storedData = localStorage.getItem(messageId);
                 if (!storedData) return null;
     
                 const data = JSON.parse(storedData);
                 if (Date.now() > data.expiry) {
                     localStorage.removeItem(messageId);
                     return null;
                 }
                 return data.content;
             } catch (error) {
                 console.error('Error reading from localStorage:', error);
                 return null;
             }
         };
     
         // Function to save translation to localStorage
         const saveTranslation = (translatedContent) => {
             try {
                 const data = {
                     content: translatedContent,
                     expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
                 };
                 localStorage.setItem(messageId, JSON.stringify(data));
             } catch (error) {
                 console.error('Error saving to localStorage:', error);
             }
         };
     
         // Setup revert button functionality
         const setupRevertButton = () => {
             quickTranslateElement.innerHTML = '<i class="fa-solid fa-rotate-left"></i>revert';
             quickTranslateElement.classList.add('translated');
             
             quickTranslateElement.onclick = (e) => {
                 e.stopPropagation();
                 // Revert to original content
                 messageElement.textContent = content;
                 // Reset button to translate state
                 quickTranslateElement.innerHTML = '<i class="fa-solid fa-repeat"></i>translate';
                 quickTranslateElement.classList.remove('translated');
                 // Setup translate click handler
                 setupTranslateButton();
             };
         };
     
         // Setup translate button functionality
         const setupTranslateButton = () => {
             quickTranslateElement.innerHTML = '<i class="fa-solid fa-repeat"></i>translate';
             quickTranslateElement.classList.remove('translated');
             
             quickTranslateElement.onclick = async (e) => {
                 e.stopPropagation();
                 await handleTranslation();
             };
         };
     
         // Handle translation process
         const handleTranslation = async () => {
             // First check if translation exists in localStorage
             const storedTranslation = getStoredTranslation();
             if (storedTranslation) {
                 // If found in localStorage, use it
                 messageElement.textContent = storedTranslation;
                 setupRevertButton();
                 return;
             }
     
             // If not in localStorage, make API call
             try {
                 messageContentWrapper.style.position = 'relative';
                 LoaderUtil.showLoader(messageContentWrapper);
     
                 const response = await fetch('/api/translate/quick', {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify({
                         content,
                         userChoice: 'autodetect',
                         targetLanguage: 'Hinglish'
                     })
                 });
     
                 const data = await response.json();
     
                 if (response.status === 200) {
                     // Update UI with translated content
                     messageElement.textContent = data.result;
                     
                     // Save translation to localStorage
                     saveTranslation(data.result);
                     
                     // Setup revert button
                     setupRevertButton();
                 } else if (response.status === 429) {
                      ('Too many translation requests. Please try again later.');
                 } else {
                     throw new Error(data.error || 'Translation failed');
                 }
             } catch (err) {
                 console.error('Translation error:', err);
                 popupManager.showStatus(err.message || "Transaltion failed")
             } finally {
                 if (messageContentWrapper) {
                     messageContentWrapper.style.position = '';
                     LoaderUtil.hideLoader(messageContentWrapper);
                 }
             }
         };
     
         // Initial setup
         const storedTranslation = getStoredTranslation();
         if (storedTranslation) {
             messageElement.textContent = storedTranslation;
             setupRevertButton();
         } else {
             setupTranslateButton();
         }
     },

   async handleTranslateButton(e) {
      e.preventDefault();
      const conversationId = this.currentChatId;
      const key = `currConversation${conversationId}`;
      let value = localStorage.getItem(key);

      if (value) {
         const translateBtn = e.target.querySelector('button[value="translate"]');
         const messageInput = e.target.querySelector('#messageInput');
         const inputMessage = messageInput.value.trim();

         if (!inputMessage) return;

         try {
            LoaderUtil.showButtonLoader(translateBtn);
            const preferences = this.getLanguageSelections(this.currentChatId) || {
               userChoice: 'autodetect',
               targetLanguage: 'english'
            };

            const response = await fetch('/api/translate', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                  inputMessage,
                  userChoice: preferences.userChoice,
                  targetLanguage: preferences.targetLanguage
               })
            });

            console.log(response);

            const data = await response.json();
            if (response.status === 200) {
               messageInput.value = data.result;
            } else if (response.status === 429) {
               alert('Too many translation requests. Please try again later.');
            } else {
               throw new Error(data.error || 'Translation failed');
            }
         } catch (err) {
            console.error('Translation error:', err);
            if(err.message){
            popupManager.showStatus("Too many request", type = "error")
            }
         } finally {
            LoaderUtil.hideButtonLoader(translateBtn);
         }
      } else {
         popupManager.toggleTranslationSetting();
      }
   },

   async addMessage(content) {
      try {
         const response = await axios.post('/api/message', {
            content,
            senderId: this.currentUserId,
            conversationId: this.currentChatId
         });

         if (response.data) {
            let message = response.data.content;
            let timestamp = response.data.timestamp;
            let messageId = response.data.id; // Make sure your API returns the message ID

            const isTime = new Date(timestamp).toLocaleString('en-IN', {
               timeZone: 'Asia/Kolkata',
               hour12: true,
               hour: '2-digit',
               minute: '2-digit'
            });

            // Include messageId in socket emit
            this.socket.emit('newMessage', {
               conversationId: this.currentChatId,
               content: message,
               time: isTime,
               senderId: this.currentUserId,
               messageId: messageId // Add this
            });
            return response.data;
         }
         return null;
      } catch (err) {
         console.error('Error sending message:', err);
      }
   },

   openProfileSetting() {
      let profileOverlay = document.getElementById('profileOverlay');
      profileOverlay.classList.add('active');
   },

   closeProfileSetting() {
      let profileOverlay = document.getElementById('profileOverlay');
      profileOverlay.classList.remove('active');
   },

   // chat setting slide overlay
   toggleChatSetting() {
      let slideOverlay = document.getElementById('slideOverlay');
      slideOverlay.classList.toggle('active');
   },

   closeOverlaySetting() {
      let slideOverlay = document.getElementById('slideOverlay');
      slideOverlay.classList.remove('active');
   }
};

const popupManager = {
   start() {
      this.attachEventListeners();
   },

   attachEventListeners() {
      document.querySelector('.menu-list').addEventListener('click', e => {
         try {
            if (e.target.id === 'translationSetting') {
               this.toggleTranslationSetting();
            } else if (e.target.id === 'clearChat') {
               try {
                  console.log('Button Clicked :');
                  ChatManager.clearChatHistory();
               } catch (error) {
                  console.error(error);
               }
            }
         } catch (error) {
            console.error(error);
         }
      });

      document.querySelector('.profile-list').addEventListener('click', e => {
         try {
            if (e.target.id === 'yourProfile') {
               window.location.href = '/api/profile';
            }
         } catch (error) {
            console.error(error);
         }
      }),
         document
            .querySelector('.close')
            .addEventListener('click', () => this.hideTranslationSetting());
   },

   toggleTranslationSetting() {
      let settingsModal = document.querySelector('.modal');

      settingsModal.classList.remove('hide');
      settingsModal.classList.add('show');
      ChatManager.loadLanguageSelections();
   },

   hideTranslationSetting() {
      let settingsModal = document.querySelector('.modal');
      settingsModal.classList.remove('show');
      settingsModal.classList.add('hide');
   },

   showStatus(message, type = 'success') {
      let statusDisplay = document.getElementById('statusDisplay');

      statusDisplay.textContent = message;
      statusDisplay.style.backgroundColor = type === 'error' ? '#dc3545' : '#28a745';
      statusDisplay.style.display = 'block';

      setTimeout(() => {
         statusDisplay.style.display = 'none';
      }, 2000);
   }
};

// LoaderUtil object to manage loader operations
const LoaderUtil = {
   // Template for bootstrap spinner with overlay
   getLoaderTemplate() {
      return `
            <div class="loader-overlay">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
   },

   // Show loader in specified container
   showLoader(containerElement) {
      // Create loader element
      const loaderEl = document.createElement('div');
      loaderEl.classList.add('loader-container');
      loaderEl.innerHTML = this.getLoaderTemplate();

      // Add loader to container
      containerElement.appendChild(loaderEl);
   },

   // Remove loader from container
   hideLoader(containerElement) {
      const loader = containerElement.querySelector('.loader-container');
      if (loader) {
         loader.remove();
      }
   },

   // Convert button to loader
   showButtonLoader(button) {
      button.classList.add('btn-loading');
      const loaderEl = document.createElement('div');
      loaderEl.classList.add('spinner-border');
      button.appendChild(loaderEl);
   },

   // Restore button from loader
   hideButtonLoader(button) {
      button.classList.remove('btn-loading');
      const loader = button.querySelector('.spinner-border');
      if (loader) {
         loader.remove();
      }
   }
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
   ChatManager.start();
   popupManager.start();
   // }
});
