
import React, { useState } from 'react';

const WelcomeScreen = ({ onJoin, onCreate }: { onJoin: (name: string, groupId: string) => void; onCreate: () => Promise<string> }) => {
  const [name, setName] = useState('');
  const [groupId, setGroupId] = useState('');

  const handleJoin = () => {
    if (name.trim() && groupId.trim()) {
      onJoin(name.trim(), groupId.trim());
    } else {
      alert('لطفاً نام و آیدی گروه را وارد کنید.');
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
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            نام
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            onClick={async () => {
              const groupId = await onCreate();
              setGroupId(groupId);
            }}
            className="w-full bg-gray-700 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition duration-200 shadow-lg"
          >
            ساخت گروه جدید
          </button>
        </div>

      </div>
    </div>
  );
};

export default WelcomeScreen;