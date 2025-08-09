import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Globe, Heart, Music, GraduationCap, ChevronDown } from 'lucide-react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const messagesEndRef = useRef(null);

  // Static room data
  const staticRooms = [
    { id: 'general', name: 'General Chat', description: 'General discussion', userCount: Math.floor(Math.random() * 50) + 1 },
    { id: 'tech', name: 'Tech Talk', description: 'Technology discussions', userCount: Math.floor(Math.random() * 30) + 1 },
    { id: 'gaming', name: 'Gaming', description: 'Gaming discussions', userCount: Math.floor(Math.random() * 40) + 1 },
    { id: 'music', name: 'Music', description: 'Music and entertainment', userCount: Math.floor(Math.random() * 25) + 1 },
    { id: 'sports', name: 'Sports', description: 'Sports discussions', userCount: Math.floor(Math.random() * 20) + 1 },
    { id: 'food', name: 'Food & Cooking', description: 'Food and cooking', userCount: Math.floor(Math.random() * 15) + 1 },
    { id: 'movies', name: 'Movies & TV', description: 'Movies and TV shows', userCount: Math.floor(Math.random() * 35) + 1 },
    { id: 'books', name: 'Books', description: 'Book discussions', userCount: Math.floor(Math.random() * 12) + 1 },
    { id: 'travel', name: 'Travel', description: 'Travel experiences', userCount: Math.floor(Math.random() * 18) + 1 },
    { id: 'fitness', name: 'Fitness', description: 'Health and fitness', userCount: Math.floor(Math.random() * 22) + 1 },
    { id: 'art', name: 'Art & Design', description: 'Art and design', userCount: Math.floor(Math.random() * 16) + 1 },
    { id: 'science', name: 'Science', description: 'Science discussions', userCount: Math.floor(Math.random() * 14) + 1 },
    { id: 'business', name: 'Business', description: 'Business and entrepreneurship', userCount: Math.floor(Math.random() * 28) + 1 },
    { id: 'education', name: 'Education', description: 'Learning and education', userCount: Math.floor(Math.random() * 19) + 1 },
    { id: 'random', name: 'Random', description: 'Random conversations', userCount: Math.floor(Math.random() * 45) + 1 },
    { id: 'help', name: 'Help & Support', description: 'Get help and support', userCount: Math.floor(Math.random() * 8) + 1 }
  ];

  // Helper function to get URL parameters
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      username: params.get('username'),
      room: params.get('room')
    };
  };

  // Helper function to update URL
  const updateUrl = (username, roomId) => {
    const params = new URLSearchParams();
    if (username) params.set('username', username);
    if (roomId) params.set('room', roomId);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  useEffect(() => {
    // Initialize rooms
    setRooms(staticRooms);

    // Try to restore session from URL parameters
    const urlParams = getUrlParams();
    if (urlParams.username) {
      setUsername(urlParams.username);
      setUser({
        id: 'demo-user',
        username: urlParams.username,
        joinedAt: new Date().toISOString()
      });
      
      if (urlParams.room) {
        const room = staticRooms.find(r => r.id === urlParams.room);
        if (room) {
          setCurrentRoom({
            roomId: room.id,
            roomName: room.name,
            messages: [
              {
                id: 1,
                username: 'ChatBot',
                content: `Welcome to ${room.name}! This is a demo version of ChatKaro.`,
                timestamp: new Date().toISOString()
              },
              {
                id: 2,
                username: 'System',
                content: 'For full real-time functionality, deploy the backend server to a platform like Render or Railway.',
                timestamp: new Date().toISOString()
              }
            ]
          });
          setMessages([
            {
              id: 1,
              username: 'ChatBot',
              content: `Welcome to ${room.name}! This is a demo version of ChatKaro.`,
              timestamp: new Date().toISOString()
            },
            {
              id: 2,
              username: 'System',
              content: 'For full real-time functionality, deploy the backend server to a platform like Render or Railway.',
              timestamp: new Date().toISOString()
            }
          ]);
          setOnlineUsers(['ChatBot', 'System', urlParams.username]);
        }
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setJoinError('Please enter a username');
      return;
    }
    
    if (trimmedUsername.length < 2) {
      setJoinError('Username must be at least 2 characters long');
      return;
    }
    
    if (trimmedUsername.length > 20) {
      setJoinError('Username must be 20 characters or less');
      return;
    }
    
    setIsJoining(true);
    setJoinError('');
    
    // Simulate user joining
    setTimeout(() => {
      const userData = {
        id: 'demo-user',
        username: trimmedUsername,
        joinedAt: new Date().toISOString()
      };
      setUser(userData);
      updateUrl(trimmedUsername, null);
      setIsJoining(false);
    }, 500);
  };

  const joinRoom = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const roomData = {
      roomId: room.id,
      roomName: room.name,
      messages: [
        {
          id: Date.now(),
          username: 'ChatBot',
          content: `Welcome to ${room.name}! This is a demo version of ChatKaro.`,
          timestamp: new Date().toISOString()
        },
        {
          id: Date.now() + 1,
          username: 'System',
          content: 'Messages you send here are stored locally. For full real-time chat, deploy the backend server.',
          timestamp: new Date().toISOString()
        }
      ]
    };

    setCurrentRoom(roomData);
    setMessages(roomData.messages);
    setOnlineUsers(['ChatBot', 'System', user.username]);
    updateUrl(user.username, roomId);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && currentRoom && user) {
      const message = {
        id: Date.now(),
        username: user.username,
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate a response
      setTimeout(() => {
        const responses = [
          "That's interesting!",
          "I see what you mean.",
          "Great point!",
          "Thanks for sharing!",
          "Cool! 👍"
        ];
        const response = {
          id: Date.now() + Math.random(),
          username: 'Demo Bot',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, response]);
      }, 1000 + Math.random() * 2000);
    }
  };

  // Group rooms by category
  const groupedRooms = rooms.reduce((acc, room) => {
    let category = 'General';
    
    if (['tech', 'science'].includes(room.id)) category = 'Technology';
    else if (['gaming', 'sports'].includes(room.id)) category = 'Entertainment';
    else if (['music', 'art', 'movies', 'books'].includes(room.id)) category = 'Creative';
    else if (['business', 'education'].includes(room.id)) category = 'Professional';
    else if (['food', 'travel', 'fitness'].includes(room.id)) category = 'Lifestyle';
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(room);
    return acc;
  }, {});

  const getCategoryIcon = (category) => {
    const icons = {
      'General': <MessageCircle className="w-4 h-4" />,
      'Technology': <Globe className="w-4 h-4" />,
      'Entertainment': <Heart className="w-4 h-4" />,
      'Creative': <Music className="w-4 h-4" />,
      'Professional': <GraduationCap className="w-4 h-4" />,
      'Lifestyle': <ChevronDown className="w-4 h-4" />
    };
    return icons[category] || <MessageCircle className="w-4 h-4" />;
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <MessageCircle className="w-12 h-12 text-blue-500" />
            <h1>ChatKaro</h1>
            <p>Demo Version - Free Online Chat Rooms</p>
          </div>
          <form onSubmit={handleJoin} className="login-form">
            <input
              type="text"
              placeholder="Enter your username (2-20 characters)"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (joinError) {
                  setJoinError('');
                }
              }}
              maxLength={20}
              disabled={isJoining}
              required
            />
            {joinError && (
              <div className="error-message">
                {joinError}
              </div>
            )}
            <button type="submit" disabled={isJoining} className="join-button">
              {isJoining ? 'Joining...' : 'Join Chat'}
            </button>
          </form>
          <div className="login-footer">
            <p>Demo version with simulated responses</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <MessageCircle className="w-6 h-6" />
            <h1>ChatKaro</h1>
          </div>
          <div className="header-center">
            {isConnected ? (
              <span className="status-indicator connected">● Demo Mode</span>
            ) : (
              <span className="status-indicator disconnected">● Offline</span>
            )}
          </div>
          <div className="header-right">
            <span className="username">Welcome, {user.username}!</span>
          </div>
        </div>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Chat Rooms</h2>
          </div>
          
          <div className="rooms-container">
            {Object.entries(groupedRooms).map(([category, categoryRooms]) => (
              <div key={category} className="room-category">
                <h3 className="category-title">
                  {getCategoryIcon(category)}
                  {category}
                </h3>
                <div className="rooms-list">
                  {categoryRooms.map(room => (
                    <button
                      key={room.id}
                      onClick={() => joinRoom(room.id)}
                      className={`room-item ${currentRoom?.roomId === room.id ? 'active' : ''}`}
                    >
                      <div className="room-info">
                        <span className="room-name">{room.name}</span>
                        <span className="room-description">{room.description}</span>
                      </div>
                      <div className="room-users">
                        <Users className="w-4 h-4" />
                        <span>{room.userCount || 0}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="chat-area">
          {currentRoom ? (
            <>
              <div className="chat-header">
                <div className="chat-title">
                  <h2>{currentRoom.roomName}</h2>
                  <div className="online-count">
                    <Users className="w-4 h-4" />
                    <span>{onlineUsers.length} online</span>
                  </div>
                </div>
              </div>

              <div className="messages-container">
                <div className="messages" ref={messagesEndRef}>
                  {messages.map((message) => (
                    <div key={message.id} className="message">
                      <div className="message-header">
                        <span className="message-username">{message.username}</span>
                        <span className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="message-content">
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <form onSubmit={sendMessage} className="message-input-container">
                <div className="message-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    maxLength={1000}
                  />
                  <button type="submit" disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="welcome-screen">
              <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
              <h2>Welcome to ChatKaro!</h2>
              <p>Select a chat room to start messaging</p>
              <div className="demo-notice">
                <p><strong>Demo Version</strong></p>
                <p>This is a frontend-only demo. For full real-time functionality, deploy the backend server to Render or Railway.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
