import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { Send, Users, MessageCircle, Globe, Heart, Music, GraduationCap, ChevronDown } from 'lucide-react';
import './App.css';

const socket = io(process.env.NODE_ENV === 'production' ? 'https://chatkaro-backend-updated-1.onrender.com' : 'http://localhost:5000', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Private Chat Popup Component
function PrivateChatPopup({ chat, onClose, onMinimize, onSendMessage, currentUser }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className={`private-chat-popup ${chat.isMinimized ? 'minimized' : ''}`}>
      <div className="private-chat-header">
        <div className="private-chat-title">
          <div className="user-avatar small">
            {chat.username.charAt(0).toUpperCase()}
          </div>
          <span>{chat.username}</span>
          {chat.unreadCount > 0 && (
            <span className="unread-badge">{chat.unreadCount}</span>
          )}
        </div>
        <div className="private-chat-controls">
          <button onClick={onMinimize} className="minimize-btn">
            {chat.isMinimized ? '▲' : '▼'}
          </button>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
      </div>
      
      {!chat.isMinimized && (
        <div className="private-chat-body">
          <div className="private-chat-messages">
            {chat.messages.map((msg, index) => (
              <div key={index} className={`private-message ${msg.from === currentUser ? 'sent' : 'received'}`}>
                <div className="private-message-content">
                  <span className="private-message-text">{msg.content}</span>
                  <span className="private-message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSend} className="private-chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${chat.username}...`}
              maxLength={500}
            />
            <button type="submit" disabled={!message.trim()}>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const audioRef = useRef(null);
  const usersDropdownRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  const playNotificationSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch(e => {
        console.log('Could not play notification sound:', e);
      });
    }
  }, [soundEnabled]);

  const startPrivateChat = (username) => {
    if (username === user?.username) return; // Can't chat with yourself
    
    setPrivateChats(prev => {
      const newChats = new Map(prev);
      if (!newChats.has(username)) {
        newChats.set(username, {
          username,
          messages: [],
          isMinimized: false,
          unreadCount: 0
        });
      }
      return newChats;
    });
    setShowUsersDropdown(false);
  };

  const closePrivateChat = (username) => {
    setPrivateChats(prev => {
      const newChats = new Map(prev);
      newChats.delete(username);
      return newChats;
    });
  };

  const minimizePrivateChat = (username) => {
    setPrivateChats(prev => {
      const newChats = new Map(prev);
      const chat = newChats.get(username);
      if (chat) {
        newChats.set(username, { 
          ...chat, 
          isMinimized: !chat.isMinimized,
          unreadCount: chat.isMinimized ? 0 : chat.unreadCount // Clear unread when opening
        });
      }
      return newChats;
    });
  };

  const sendPrivateMessage = (toUsername, message) => {
    if (!message.trim()) return;
    
    const privateMessage = {
      id: Date.now(),
      from: user.username,
      to: toUsername,
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    // Add message to local chat
    setPrivateChats(prev => {
      const newChats = new Map(prev);
      const chat = newChats.get(toUsername);
      if (chat) {
        newChats.set(toUsername, {
          ...chat,
          messages: [...chat.messages, privateMessage]
        });
      }
      return newChats;
    });

    // Emit to server
    socket.emit('private_message', privateMessage);
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!isAtBottom && messages.length > 5);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Click outside handler for users dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (usersDropdownRef.current && !usersDropdownRef.current.contains(event.target)) {
        setShowUsersDropdown(false);
      }
    };

    if (showUsersDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUsersDropdown]);

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
    // Try to restore session from URL parameters
    const urlParams = getUrlParams();
    if (urlParams.username) {
      console.log('Restoring session from URL:', urlParams);
      setUsername(urlParams.username);
      // We'll restore the user and room after connecting to server
    }
    setIsRestoringSession(false);

    // Handle connection events
    socket.on('connect', () => {
      console.log('Connected to server successfully!');
      console.log('Socket ID:', socket.id);
      setIsConnected(true);
      
      // Try to restore session from URL if we have parameters
      const urlParams = getUrlParams();
      if (urlParams.username && !user) {
        console.log('Attempting to restore session for:', urlParams.username);
        socket.emit('restore_session', urlParams);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      setIsConnected(false);
      // Reset state on disconnect
      setCurrentRoom(null);
      setMessages([]);
      setOnlineUsers([]);
      setTypingUsers([]);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Socket event listeners
    socket.on('rooms_list', (roomsList) => {
      console.log('Received rooms list:', roomsList);
      setRooms(roomsList);
    });

    socket.on('user_joined', (userData) => {
      setUser(userData);
      setIsJoining(false);
      setJoinError('');
      setUsernameSuggestions([]);
      
      // Update URL with username
      updateUrl(userData.username, null);
      console.log('Username saved to URL');
    });

    socket.on('session_restored', (sessionData) => {
      console.log('Session restored successfully:', sessionData);
      setUser(sessionData.user);
      if (sessionData.currentRoom) {
        setCurrentRoom(sessionData.currentRoom);
        setMessages(sessionData.currentRoom.messages || []);
        setOnlineUsers(sessionData.currentRoom.users || []);
        // Update URL to match restored session
        updateUrl(sessionData.user.username, sessionData.currentRoom.roomId);
      }
      setIsRestoringSession(false);
    });

    socket.on('session_restore_failed', (error) => {
      console.log('Session restore failed:', error.message);
      // Clear URL parameters if session restore fails
      window.history.replaceState({}, '', window.location.pathname);
      setIsRestoringSession(false);
    });

    socket.on('join_error', (error) => {
      console.error('Join error:', error.message);
      setJoinError(error.message);
      setUsernameSuggestions(error.suggestions || []);
      setIsJoining(false);
    });

    socket.on('room_joined', (roomData) => {
      setCurrentRoom(roomData);
      setMessages(roomData.messages);
      setOnlineUsers(roomData.users);
      
      // Add a welcome message
      const welcomeMessage = {
        id: `welcome-${Date.now()}`,
        username: 'System',
        content: `Welcome to ${roomData.roomName}! ${roomData.users?.length || 0} users are online. Start chatting!`,
        timestamp: new Date().toISOString(),
        isSystemMessage: true
      };
      setTimeout(() => {
        setMessages(prev => [...prev, welcomeMessage]);
      }, 500);
      
      // Update URL with current room
      if (user) {
        updateUrl(user.username, roomData.roomId);
        console.log('Current room saved to URL:', roomData.roomName);
      }
    });

    socket.on('new_message', (message) => {
      console.log('Received new message:', message);
      setMessages(prev => [...prev, message]);
      // Play notification sound for messages from other users
      if (message.username !== user?.username) {
        playNotificationSound();
      }
      // Auto-scroll to bottom when receiving a message
      setTimeout(scrollToBottom, 100);
    });

    socket.on('private_message', (message) => {
      console.log('Received private message:', message);
      const fromUser = message.from;
      
      // Add message to private chat
      setPrivateChats(prev => {
        const newChats = new Map(prev);
        let chat = newChats.get(fromUser);
        
        if (!chat) {
          // Create new chat if it doesn't exist
          chat = {
            username: fromUser,
            messages: [],
            isMinimized: true,
            unreadCount: 0
          };
        }
        
        // Add message and increment unread count if minimized
        const updatedChat = {
          ...chat,
          messages: [...chat.messages, message],
          unreadCount: chat.isMinimized ? chat.unreadCount + 1 : chat.unreadCount
        };
        
        newChats.set(fromUser, updatedChat);
        return newChats;
      });
      
      // Play notification sound
      if (message.from !== user?.username) {
        playNotificationSound();
      }
    });

    socket.on('user_joined_room', (data) => {
      setOnlineUsers(prev => [...prev, data.username]);
    });

    socket.on('user_left', (data) => {
      console.log('User left:', data.username);
      // Use the updated users list if provided, otherwise filter out the user
      if (data.updatedUsers) {
        setOnlineUsers(data.updatedUsers);
      } else {
        setOnlineUsers(prev => prev.filter(u => u !== data.username));
      }
    });

    socket.on('room_updated', (data) => {
      setRooms(prev => prev.map(room => 
        room.id === data.roomId 
          ? { ...room, userCount: data.userCount }
          : room
      ));
    });

    socket.on('user_typing', (username) => {
      setTypingUsers(prev => [...new Set([...prev, username])]);
    });

    socket.on('user_stopped_typing', (username) => {
      setTypingUsers(prev => prev.filter(u => u !== username));
    });

    // Handle heartbeat
    socket.on('pong', () => {
      // Server responded to ping
    });

    // Send periodic heartbeat
    const heartbeat = setInterval(() => {
      if (socket.connected) {
        socket.emit('ping');
      }
    }, 30000); // Every 30 seconds

    // Handle browser close/refresh
    const handleBeforeUnload = () => {
      if (user) {
        socket.emit('leave_chat');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Handle browser navigation (back/forward buttons)
    const handlePopState = () => {
      const urlParams = getUrlParams();
      console.log('Browser navigation detected, URL params:', urlParams);
      
      if (urlParams.username && urlParams.username !== user?.username) {
        // Username changed via browser navigation
        if (user) {
          // User is already logged in but URL username is different
          // We could either logout and re-login or ignore this
          console.log('Username mismatch detected via navigation');
        } else {
          // No user logged in, attempt to restore from URL
          setUsername(urlParams.username);
          if (socket.connected) {
            socket.emit('restore_session', urlParams);
          }
        }
      }
      
      if (urlParams.room && urlParams.room !== currentRoom?.roomId) {
        // Room changed via browser navigation
        if (user && rooms.find(r => r.id === urlParams.room)) {
          console.log('Joining room from URL navigation:', urlParams.room);
          socket.emit('join_room', urlParams.room);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup function
    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('rooms_list');
      socket.off('user_joined');
      socket.off('session_restored');
      socket.off('session_restore_failed');
      socket.off('join_error');
      socket.off('room_joined');
      socket.off('new_message');
      socket.off('user_joined_room');
      socket.off('user_left');
      socket.off('room_updated');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
      socket.off('pong');
    };
  }, [user, currentRoom?.roomId, rooms, playNotificationSound]);

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
    socket.emit('join', { username: trimmedUsername });
  };

  const joinRoom = (roomId) => {
    socket.emit('join_room', { roomId });
    // Update URL immediately when joining room
    if (user) {
      updateUrl(user.username, roomId);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && currentRoom) {
      socket.emit('send_message', { content: newMessage.trim() });
      setNewMessage('');
      handleStopTyping();
      // Auto-scroll to bottom when sending a message
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing_start');
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      socket.emit('typing_stop');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Regional': return <Globe className="w-4 h-4" />;
      case 'Social': return <Heart className="w-4 h-4" />;
      case 'Entertainment': return <Music className="w-4 h-4" />;
      case 'Education': return <GraduationCap className="w-4 h-4" />;
      case 'International': return <Globe className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.category]) {
      acc[room.category] = [];
    }
    acc[room.category].push(room);
    return acc;
  }, {});

  console.log('Current rooms state:', rooms);
  console.log('Grouped rooms:', groupedRooms);

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <MessageCircle className="w-12 h-12 text-blue-500" />
            <h1>ChatKaro</h1>
            <p>{isRestoringSession ? 'Restoring your session...' : 'Free Online Chat Rooms'}</p>
          </div>
          <form onSubmit={handleJoin} className="login-form">
            <input
              type="text"
              placeholder="Enter your username (2-20 characters)"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (joinError) {
                  setJoinError(''); // Clear error when typing
                  setUsernameSuggestions([]);
                }
              }}
              maxLength={20}
              disabled={isJoining}
              required
            />
            {joinError && (
              <div className="error-message">
                {joinError}
                {usernameSuggestions.length > 0 && (
                  <div className="username-suggestions">
                    <p>Try these instead:</p>
                    <div className="suggestions-list">
                      {usernameSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-btn"
                          onClick={() => {
                            setUsername(suggestion);
                            setJoinError('');
                            setUsernameSuggestions([]);
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button type="submit" disabled={isJoining || !username.trim()}>
              {isJoining ? 'Joining...' : 'Join Chat'}
            </button>
          </form>
          <div className="login-footer">
            <p>Connect with people from around the world</p>
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
            <MessageCircle className="w-8 h-8" />
            <h1>ChatKaro</h1>
          </div>
          <div className="header-center">
            {/* Google Ads - Header Banner */}
            <div className="ad-space header-ad">
              <div className="ad-placeholder">
                <span>Advertisement</span>
              </div>
            </div>
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
          
          {/* Google Ads - Sidebar Top */}
          <div className="ad-space sidebar-ad-top">
            <div className="ad-placeholder">
              <span>Advertisement</span>
            </div>
          </div>
          
          <div className="rooms-container">
            {rooms.length === 0 ? (
              <div style={{padding: '20px', textAlign: 'center', color: '#666'}}>
                {isConnected ? 'Loading chat rooms...' : 'Connecting to server...'}
              </div>
            ) : (
              Object.entries(groupedRooms).map(([category, categoryRooms]) => (
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
              ))
            )}
          </div>
          
          {/* Google Ads - Sidebar Bottom */}
          <div className="ad-space sidebar-ad-bottom">
            <div className="ad-placeholder">
              <span>Advertisement</span>
            </div>
          </div>
        </aside>

        <main className="chat-area">
          {currentRoom ? (
            <>
              <div className="chat-header">
                <div className="chat-title">
                  <h2>{currentRoom.roomName}</h2>
                  <span 
                    className="online-count clickable"
                    onClick={() => setShowUsersDropdown(!showUsersDropdown)}
                  >
                    <Users className="w-4 h-4" />
                    {onlineUsers.length} online
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
                <button 
                  className={`sound-toggle ${soundEnabled ? 'enabled' : 'disabled'}`}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Disable sound notifications' : 'Enable sound notifications'}
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
              </div>

              {/* Users Dropdown */}
              {showUsersDropdown && (
                <div className="users-dropdown" ref={usersDropdownRef}>
                  <div className="users-dropdown-header">
                    <h4>Online Users ({onlineUsers.length})</h4>
                  </div>
                  <div className="users-list">
                    {onlineUsers.map((username, index) => (
                      <div 
                        key={index}
                        className={`user-item ${username === user?.username ? 'current-user' : ''}`}
                        onClick={() => username !== user?.username && startPrivateChat(username)}
                      >
                        <div className="user-avatar">
                          {username.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{username}</span>
                        {username === user?.username && <span className="you-badge">(You)</span>}
                        {username !== user?.username && <span className="chat-hint">Click to chat</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="messages-container">
                <div className="messages" ref={messagesContainerRef} onScroll={handleScroll}>
                  {messages.map((message, index) => (
                    <div key={message.id}>
                      <div className="message">
                        <div className="message-header">
                          <span className="message-username">{message.username}</span>
                          <span className="message-time">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="message-content">{message.content}</div>
                      </div>
                      {/* Show ad every 10 messages */}
                      {(index + 1) % 10 === 0 && index < messages.length - 1 && (
                        <div className="ad-space message-ad">
                          <div className="ad-placeholder">
                            <span>Advertisement</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {typingUsers.length > 0 && (
                    <div className="typing-indicator">
                      <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Scroll to bottom button */}
                {showScrollButton && (
                  <button className="scroll-to-bottom" onClick={scrollToBottom}>
                    <ChevronDown className="w-5 h-5" />
                  </button>
                )}
              </div>

              <form onSubmit={sendMessage} className="message-form">
                <input
                  type="text"
                  placeholder="Type your message... (Press Enter to send)"
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  maxLength={500}
                  autoComplete="off"
                />
                <button type="submit" disabled={!newMessage.trim()}>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="welcome-screen">
              <div className="welcome-content">
                <MessageCircle className="w-16 h-16 text-blue-500" />
                <h2>Welcome to ChatKaro</h2>
                <p>Select a chat room from the sidebar to start chatting!</p>
                
                {/* Google Ads - Welcome Screen */}
                <div className="ad-space welcome-ad">
                  <div className="ad-placeholder">
                    <span>Advertisement</span>
                  </div>
                </div>
                
                <div className="features">
                  <div className="feature">
                    <Globe className="w-6 h-6" />
                    <span>Regional Chat Rooms</span>
                  </div>
                  <div className="feature">
                    <Heart className="w-6 h-6" />
                    <span>Make New Friends</span>
                  </div>
                  <div className="feature">
                    <Users className="w-6 h-6" />
                    <span>Real-time Messaging</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {currentRoom && (
          <aside className="users-sidebar">
            <div className="users-header">
              <h3>Online Users</h3>
              <span className="users-count">{onlineUsers.length}</span>
            </div>
            
            {/* Google Ads - Users Sidebar */}
            <div className="ad-space users-ad">
              <div className="ad-placeholder">
                <span>Advertisement</span>
              </div>
            </div>
            
            <div className="users-list">
              {onlineUsers.map((username, index) => (
                <div key={index} className="user-item">
                  <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
                  <span className="user-name">{username}</span>
                </div>
              ))}
            </div>
          </aside>
        )}
        
      </div>
      
      {/* Google Ads - Footer Banner */}
      <footer className="app-footer">
        <div className="ad-space footer-ad">
          <div className="ad-placeholder">
            <span>Advertisement</span>
          </div>
        </div>
      </footer>
      
      {/* Private Chat Popups */}
      {Array.from(privateChats.entries()).map(([username, chat]) => (
        <PrivateChatPopup
          key={username}
          chat={chat}
          onClose={() => closePrivateChat(username)}
          onMinimize={() => minimizePrivateChat(username)}
          onSendMessage={(message) => sendPrivateMessage(username, message)}
          currentUser={user?.username}
        />
      ))}
      
      {/* Hidden audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYfCCqAzPLZiTYIG2m98OScTwwOUarm7bhkGgU7k9n1unEoBC15yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>
    </div>
  );
}

export default App;
