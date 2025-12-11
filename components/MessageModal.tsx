import React from 'react';
import { useMessageStore } from '@/lib/messageStore';

const MessageModal = () => {
  const { message } = useMessageStore();

  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 max-w-sm w-full mx-4">
        <p className="text-center text-gray-800">{message}</p>
      </div>
    </div>
  );
};

export default MessageModal;