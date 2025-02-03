# Connecter - with AI

## Description

This is full-stack messenger application that allows users to send and receive real-time messages. It includes features usch as authentication, real-time messaging.

## Key Features

-   **User Authentication**: Sign up, log in, and log out functionality.
-   **Real-Time Messaging**: Send and receive messages in real-time using WebSockets.
-   **Messeage Translation**: Translate text before sending to user to any language.
-   **User Profile**: Add profile picture and other details.

## Technologies Used

-   **Frontend**: React, TailwindCSS, Vite
-   **Backend**: Node.js, Express, WebSockets
-   **Database**: Postgres
-   **ORM**: Primsa
-   **Authentication**: Firebase Authentication
-   **Deployment**: Vercel (Frontend), Render (Backend)

## Installation

### Frontend

1.Navigate to the frontend folder:

```bash
cd connecter/frontend
```

2. Install Dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### Backend

1.Navigate to the backend folder:

```bash
cd connecter/backend
```

2. Install Dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### WebSocket

1.Navigate to the backend folder:

```bash
cd connecter/ws
```

2. Install Dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

### Frontend

-   **VITE_API_URL**=http://localhost:Backned-port
-   **VITE_WS_URL**=ws://localhost:Websocket-port

### Backend

-   **DATABASE_URL**= "Postgres Connection String"
-   **OPENROUTER_API_KEY**= "Your Openrouter Api key"
-   **FIREBASE_KEY**= "Your firebase private key"

### WebSocket

-   **PORT**=port
