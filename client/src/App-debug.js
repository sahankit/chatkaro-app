import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://chatkaro-backend-pxk5.onrender.com', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('Component mounted, setting up socket listeners');

    socket.on('connect', () => {
      addLog('✅ Connected to backend!');
      setConnectionStatus('Connected');
    });

    socket.on('disconnect', () => {
      addLog('❌ Disconnected from backend');
      setConnectionStatus('Disconnected');
    });

    socket.on('connect_error', (error) => {
      addLog(`❌ Connection error: ${error.message}`);
      setConnectionStatus('Connection Error');
    });

    socket.on('rooms_list', (rooms) => {
      addLog(`📋 Received ${rooms.length} rooms from backend`);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('rooms_list');
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>ChatKaro Connection Debug</h1>
      <h2>Status: {connectionStatus}</h2>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Connection Logs:</h3>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          maxHeight: '300px', 
          overflowY: 'auto',
          border: '1px solid #ccc'
        }}>
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => {
          addLog('Testing backend health...');
          fetch('https://chatkaro-backend-pxk5.onrender.com/health')
            .then(res => res.json())
            .then(data => addLog(`✅ Backend health: ${JSON.stringify(data)}`))
            .catch(err => addLog(`❌ Backend health error: ${err.message}`));
        }}>
          Test Backend Health
        </button>
      </div>
    </div>
  );
}

export default App;
