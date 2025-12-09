
import React, { useState, useRef, useEffect } from 'react';

interface ChatRoomProps {
  username: string;
  groupId: string;
  onLeave: () => void;
}

interface Message {
  user: string;
  text: string;
  type: 'system' | 'other' | 'me';
}

const mockMessages: Message[] = [
  { user: 'سیستم', text: 'شما به گروه Code-2024 پیوستید.', type: 'system' },
  { user: 'علی', text: 'سلام بچه‌ها، حالتون چطوره؟', type: 'other' },
  { user: 'شما', text: 'من خوبم، ممنون.', type: 'me' },
];

const ChatRoom = ({ username, groupId, onLeave }: ChatRoomProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>(mockMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;
    
    
    const newMessage: Message = { user: username, text: inputMessage, type: 'me' };
    setMessages(prev => [...prev, newMessage]);
    
    setInputMessage('');
  };

  const renderMessage = (msg: Message, index: number) => {
    const isSystem = msg.type === 'system';
    const isMe = msg.type === 'me';

    if (isSystem) {
      return (
        <div key={index} className="flex justify-center my-4">
          <div className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full shadow text-sm font-medium">
            {msg.text}
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`flex ${isMe ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg relative 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'`}>
          <div className={`text-xs font-semibold mb-1`}>
            {msg.user}
          </div>
          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
          <div className={`text-xs mt-2 `}>
            {new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
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
              <p className="text-gray-300 text-sm">آنلاین • {messages.length} پیام</p>
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