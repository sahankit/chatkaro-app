# ChatKaro - Free Online Chat Rooms

A modern, real-time chat application inspired by chatkaro.in, built with React and Node.js.

## Features

- **Multiple Chat Rooms**: Regional, social, entertainment, and international chat rooms
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **User Management**: Join/leave notifications and online user lists
- **Typing Indicators**: See when others are typing
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## Chat Room Categories

### Regional Rooms
- India General, Kerala, Tamil, Telugu, Chennai, Mumbai, Delhi, Bangalore

### Social & Entertainment
- Friendship, Music, College, Teen, Random Chat

### International
- USA, Philippines, Global

## Quick Start

1. **Install dependencies for all parts of the application:**
   ```bash
   npm run install-all
   ```

2. **Start the development servers:**
   ```bash
   npm run dev
   ```

This will start both the server (port 5000) and client (port 3000) simultaneously.

## Manual Setup

If you prefer to run each part separately:

### Server Setup
```bash
cd server
npm install
npm run dev
```

### Client Setup
```bash
cd client
npm install
npm start
```

## Project Structure

```
chat/
├── client/          # React frontend application
│   ├── src/
│   │   ├── App.js   # Main React component
│   │   ├── App.css  # Styles
│   │   └── index.js # React entry point
│   └── package.json
├── server/          # Node.js backend server
│   ├── index.js     # Express + Socket.IO server
│   └── package.json
└── package.json     # Root package.json with scripts
```

## Technology Stack

- **Frontend**: React 18, Socket.IO Client, Lucide React (icons)
- **Backend**: Node.js, Express, Socket.IO
- **Real-time Communication**: WebSockets via Socket.IO
- **Styling**: CSS3 with modern design patterns

## Usage

1. Open your browser to `http://localhost:3000`
2. Enter a username to join the chat
3. Select a chat room from the sidebar
4. Start chatting with other users in real-time!

## Features in Detail

- **Room Categories**: Organized by region, topic, and international locations
- **User Avatars**: Auto-generated avatars with user initials
- **Message History**: Last 50 messages are preserved per room
- **Online Status**: See who's currently in each room
- **Typing Indicators**: Real-time typing status
- **Responsive Layout**: Adapts to mobile and desktop screens

## Development

The application uses:
- Hot reloading for both client and server during development
- Modern ES6+ JavaScript
- Component-based React architecture
- Event-driven Socket.IO communication
- Clean, maintainable code structure

## License

MIT License - feel free to use this code for your own projects!
