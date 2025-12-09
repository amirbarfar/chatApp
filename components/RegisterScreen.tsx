import React, { useState } from 'react';

const RegisterScreen = ({ onRegister, onSwitchToLogin }: { onRegister: (name: string, phone: string, uniqueId: string) => void; onSwitchToLogin: () => void }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = () => {
    if (name.trim() && phone.trim()) {
      const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
      onRegister(name.trim(), phone.trim(), uniqueId);
    } else {
      alert('لطفاً نام و شماره تلفن خود را وارد کنید.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Modam' }}>ثبت نام</h1>
          <p className="text-gray-600">نام و شماره تلفن خود را وارد کنید</p>
        </div>

        <div className="mb-4">
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

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
            شماره تلفن
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-gray-50"
            placeholder="09123456789"
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition duration-200 shadow-lg"
        >
          ثبت نام و دریافت شماره
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            اگر حساب دارید وارد شوید
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;