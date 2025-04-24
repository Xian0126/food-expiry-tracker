import React, { useEffect } from 'react';
import AddFoodForm from '../components/AddFoodForm';
import FoodList from '../components/FoodList';

// 替換成你實際的 LINE Login 資訊
const LINE_CHANNEL_ID = '2007050235';
const REDIRECT_URI = 'https://1c8d-36-232-216-60.ngrok-free.app/food-expiry-tracker/api/callback.php';

const LINE_LOGIN_URL = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CHANNEL_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=123456&scope=openid%20profile%20email`;

export default function HomePage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('user_id');
    if (uid) {
      localStorage.setItem('user_id', uid);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = LINE_LOGIN_URL;
  };

  const isLoggedIn = !!localStorage.getItem('user_id');

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🍱 食物過期提醒應用</h1>

      {!isLoggedIn ? (
        <button
          onClick={handleLogin}
          className="bg-green-600 text-white px-4 py-2 rounded mb-6"
        >
          使用 LINE 登入
        </button>
      ) : (
        <>
          <AddFoodForm />
          <FoodList />
        </>
      )}
    </div>
  );
}
