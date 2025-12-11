import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ChatRoomProps {
  name: string;
  groupId: string;
  onLeave: () => void;
}

interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: {
    displayName: string;
  };
  type: 'other' | 'me';
}

const ChatRoom = ({ name, groupId, onLeave }: ChatRoomProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onlineCount = new Set(messages.map(m => m.user.displayName)).size;

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?uniqueId=${encodeURIComponent(groupId)}`);
        const data = await response.json();
        if (response.ok) {
          const msgs = data.messages.map((m: any) => ({
            ...m,
            type: m.user.displayName === name ? 'me' : 'other' as 'me' | 'other',
          }));
          setMessages(msgs);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    const userId = document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1];
    
    if (userId) {
      const ws = new WebSocket(`ws://localhost:3001?roomId=${encodeURIComponent(groupId)}&userId=${userId}`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          const newMsg = {
            id: Date.now(),
            content: data.content,
            createdAt: data.createdAt,
            user: { displayName: data.displayName },
            type: data.displayName === name ? 'me' : 'other' as 'me' | 'other',
          };
          
          if (newMsg.type === 'other' || newMsg.type === 'me') {
              addMessage(newMsg);
          }
        }
      };

      ws.onerror = (error) => {
          console.error('WebSocket Error:', error);
      };

      ws.onclose = () => {
        console.log('WS connection closed.');
      };

      return () => {
        ws.close();
      };
    }
  }, [groupId, name, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = inputMessage.trim();
    if (content === '') return;

    setInputMessage('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        content: content,
        displayName: name,
      }));
    }

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, uniqueId: groupId }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const renderMessage = (msg: Message, index: number) => {
    const isMe = msg.type === 'me';

    return (
      <div
        key={msg.id || index}
        className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg relative ${isMe ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
          <div className="text-xs font-semibold mb-1">
            {isMe ? 'شما' : msg.user.displayName}
          </div>
          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          <div className="text-xs mt-2 opacity-75">
            {new Date(msg.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 antialiased">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full shadow-xl bg-white border border-gray-200 rounded-t-2xl overflow-hidden">
        
        <div className="p-6 bg-gray-800 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Modam' }}>{groupId}</h2>
              <p className="text-gray-300 text-sm">{onlineCount} نفر آنلاین • {messages.length} پیام</p>
            </div>
            <div className="flex gap-4 items-center space-x-3 space-x-reverse">
              <button
                onClick={onLeave}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 font-modam text-white text-sm rounded-xl transition duration-200"
              >
                خروج
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t gap-3 bg-gray-50 flex space-x-3 space-x-reverse sticky bottom-0">
          <button
            type="submit"
            className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition duration-200 shadow-md"
          >
            ارسال
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="پیام خود را تایپ کنید..."
            className="flex-1 p-4 border outline-0 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white"
          />
        </form>

      </div>
    </div>
  );
};

export default ChatRoom;