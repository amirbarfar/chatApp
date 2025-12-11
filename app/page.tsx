'use client'

import React, { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import ChatRoom from '@/components/ChatRoom';
import MessageModal from '@/components/MessageModal';
import { useMessageStore } from '@/lib/messageStore';

function App() {
  const [appState, setAppState] = useState<'welcome' | 'chat'>('welcome');
  const [userInfo, setUserInfo] = useState({ name: '', groupId: '' });
  const { setMessage } = useMessageStore();

  const handleJoinGroup = async (name: string, groupId: string) => {
    setMessage('در حال ورود به گروه...');
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
        localStorage.setItem('userInfo', JSON.stringify({ name, groupId }));
        setMessage('ورود به گروه موفق بود!');
      } else {
        setMessage(data.error || 'خطا در ورود به گروه');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      setMessage('خطا در اتصال به سرور');
    }
  };

  const handleCreateGroup = async (): Promise<string> => {
    setMessage('در حال ساخت گروه...');
    try {
      const response = await fetch('/api/group', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('گروه با موفقیت ساخته شد!');
        return data.groupId;
      } else {
        setMessage(data.error || 'خطا در ساخت گروه');
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setMessage('خطا در اتصال به سرور');
      throw error;
    }
  };

  const handleLeaveGroup = () => {
    setAppState('welcome');
    setUserInfo({ name: userInfo.name, groupId: '' });
    localStorage.removeItem('userInfo');
  };

  useEffect(() => {
    const saved = localStorage.getItem('userInfo');
    if (saved) {
      setMessage('در حال ورود به چت...');
      const info = JSON.parse(saved);
      setUserInfo(info);
      setAppState('chat');
    }
  }, [setMessage]);

  return (
    <>
      {appState === 'welcome' ? (
        <WelcomeScreen
          onJoin={handleJoinGroup}
          onCreate={handleCreateGroup}
        />
      ) : (
        <ChatRoom
          name={userInfo.name}
          groupId={userInfo.groupId}
          onLeave={handleLeaveGroup}
        />
      )}
      <MessageModal />
    </>
  );
}

export default App;