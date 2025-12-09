'use client'

import React, { useState } from 'react';
import RegisterScreen from '@/components/RegisterScreen';
import LoginScreen from '@/components/LoginScreen';
import WelcomeScreen from '@/components/WelcomeScreen';
import ChatRoom from '@/components/ChatRoom';

function App() {
  const [appState, setAppState] = useState<'register' | 'login' | 'welcome' | 'chat'>('login');
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; uniqueId: string } | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, { name: string; uniqueId: string }>>({});
  const [userInfo, setUserInfo] = useState({ username: '', groupId: '' });

  const handleJoinGroup = (username: string, groupId: string) => {
    setUserInfo({ username, groupId });
    setAppState('chat');
  };

  const handleCreateGroup = (username : string) => {
    const newGroupId = `Room-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    handleJoinGroup(username, newGroupId);
  };

  const handleLeaveGroup = () => {
    setAppState('welcome');
    setUserInfo({ username: userInfo.username, groupId: '' });
  };

  const handleRegister = (name: string, phone: string, uniqueId: string) => {
    setRegisteredUsers(prev => ({ ...prev, [phone]: { name, uniqueId } }));
    setCurrentUser({ name, phone, uniqueId });
    setAppState('welcome');
  };

  const handleLogin = (phone: string) => {
    if (registeredUsers[phone]) {
      setCurrentUser({ name: registeredUsers[phone].name, phone, uniqueId: registeredUsers[phone].uniqueId });
      setAppState('welcome');
    } else {
      alert('شماره تلفن یافت نشد. لطفاً ثبت نام کنید.');
    }
  };

  if (appState === 'register') {
    return <RegisterScreen onRegister={handleRegister} onSwitchToLogin={() => setAppState('login')} />;
  } else if (appState === 'login') {
    return <LoginScreen onLogin={handleLogin} onSwitchToRegister={() => setAppState('register')} />;
  } else if (appState === 'welcome') {
    return (
      <WelcomeScreen
        onJoin={handleJoinGroup}
        onCreate={handleCreateGroup}
      />
    );
  } else if (appState === 'chat') {
    return (
      <ChatRoom
        username={userInfo.username}
        groupId={userInfo.groupId}
        onLeave={handleLeaveGroup}
      />
    );
  }

  return null;
}

export default App;