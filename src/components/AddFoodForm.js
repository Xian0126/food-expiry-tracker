import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddFoodForm() {
  const [name, setName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [shelfLife, setShelfLife] = useState(7); // 預設 7 天
  const [message, setMessage] = useState('');

  const handleAdd = async () => {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      setMessage('❗尚未登入，無法新增食材。');
      return;
    }

    if (!name || !purchaseDate || !shelfLife) {
      setMessage('❗請填寫完整資料。');
      return;
    }

    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + Number(shelfLife));

    const { error } = await supabase.from('foods').insert([
      {
        user_id: userId,
        name,
        purchase_date: purchaseDate,
        expiry_date: expiryDate.toISOString().split('T')[0],
      },
    ]);

    if (error) {
      console.error(error);
      setMessage('❌ 食材新增失敗，請稍後再試');
    } else {
      setMessage('✅ 食材新增成功！');
      setName('');
      setPurchaseDate('');
      setShelfLife(7);
    }
  };

  return (
    <div className="p-4 space-y-2">
      <input
        className="border p-2 mr-2"
        type="text"
        placeholder="食材名稱"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 mr-2"
        type="date"
        value={purchaseDate}
        onChange={(e) => setPurchaseDate(e.target.value)}
      />
      <input
        className="border p-2 mr-2"
        type="number"
        placeholder="保質期 (天)"
        value={shelfLife}
        onChange={(e) => setShelfLife(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAdd}
      >
        新增食材
      </button>
      <div className="text-sm mt-2">{message}</div>
    </div>
  );
}
