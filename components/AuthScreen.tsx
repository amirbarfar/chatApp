import React from 'react';

const AuthScreen = ({ onRegisterClick, onLoginClick }: { onRegisterClick: () => void; onLoginClick: () => void }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Modam' }}>به سامانه چت خوش آمدید</h1>
          <p className="text-gray-600">برای شروع ثبت نام یا ورود کنید</p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={onRegisterClick}
            className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition duration-200 shadow-lg"
          >
            ثبت نام
          </button>

          <div className="flex items-center justify-center space-x-2">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm bg-white px-2">یا</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <button
            onClick={onLoginClick}
            className="w-full bg-gray-700 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition duration-200 shadow-lg"
          >
            ورود
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;