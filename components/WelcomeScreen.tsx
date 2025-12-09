
import React, { useState } from 'react';

const WelcomeScreen = ({ onJoin, onCreate }: { onJoin: (username: string, groupId: string) => void; onCreate: (username: string) => void }) => {
  const [username, setUsername] = useState('');
  const [groupId, setGroupId] = useState('');

  const handleJoin = () => {
    if (username.trim() && groupId.trim()) {
      onJoin(username.trim(), groupId.trim());
    } else {
      alert('لطفاً نام کاربری و آیدی گروه را وارد کنید.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Modam' }}>به سامانه چت خوش آمدید</h1>
          <p className="text-gray-600">گروه خود را پیدا کنید یا جدید بسازید</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
            نام کاربری
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-gray-50"
            placeholder="مثلاً علی"
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="groupId">
            آیدی گروه
          </label>
          <input
            id="groupId"
            type="text"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-gray-50"
            placeholder="مثلاً Code-2024"
          />
        </div>

       <div className="flex flex-col space-y-4">
          <button
            onClick={handleJoin}
            className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition duration-200 shadow-lg"
          >
            عضویت در گروه
          </button>

          <div className="flex items-center justify-center space-x-2">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm bg-white px-2">یا</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <button
            onClick={() => onCreate(username)}
            disabled={!username.trim()}
            className={`w-full py-4 rounded-xl font-semibold transition duration-200 shadow-lg ${
              username.trim()
                ? 'bg-gray-700 text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            ساخت گروه جدید
          </button>
        </div>

      </div>
    </div>
  );
};

export default WelcomeScreen;