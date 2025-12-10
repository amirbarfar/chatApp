'use client'

import React, { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import ChatRoom from '@/components/ChatRoom';

function App() {
  const [appState, setAppState] = useState<'welcome' | 'chat'>('welcome');
  const [userInfo, setUserInfo] = useState({ name: '', groupId: '' });

  const handleJoinGroup = async (name: string, groupId: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, groupId }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo({ name, groupId });
        setAppState('chat');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      alert('خطا در اتصال');
    }
  };

  const handleCreateGroup = async (): Promise<string> => {
    const response = await fetch('/api/group', {
      method: 'POST',
    });
    const data = await response.json();
    if (response.ok) {
      return data.groupId;
    } else {
      throw new Error(data.error);
    }
  };

  const handleLeaveGroup = () => {
    setAppState('welcome');
    setUserInfo({ name: userInfo.name, groupId: '' });
  };

  if (appState === 'welcome') {
    return (
      <WelcomeScreen
        onJoin={handleJoinGroup}
        onCreate={handleCreateGroup}
      />
    );
  } else if (appState === 'chat') {
    return (
      <ChatRoom
        name={userInfo.name}
        groupId={userInfo.groupId}
        onLeave={handleLeaveGroup}
      />
    );
  }

  return null;
}

export default App;