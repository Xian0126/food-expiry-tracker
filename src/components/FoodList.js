import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [keyword, setKeyword] = useState('');
  const [storageFilter, setStorageFilter] = useState('');

  const fetchFoods = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    let query = supabase
      .from('foods')
      .select('*')
      .eq('user_id', userId)
      .order('expiry_date', { ascending: true });

    if (keyword) {
      query = query.ilike('name', `%${keyword}%`);
    }
    if (storageFilter) {
      query = query.eq('storage', storageFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setMessage('❌ 讀取資料失敗');
    } else {
      setFoods(data);
    }
  };

  useEffect(() => {
    const fetchFoods = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;
  
      let query = supabase
        .from('foods')
        .select('*')
        .eq('user_id', userId)
        .order('expiry_date', { ascending: true });
  
      if (keyword) query = query.ilike('name', `%${keyword}%`);
      if (storageFilter) query = query.eq('storage', storageFilter);
  
      const { data, error } = await query;
      if (error) {
        console.error(error);
        setMessage('❌ 讀取資料失敗');
      } else {
        setFoods(data);
      }
    };
  
    fetchFoods();
  }, [keyword, storageFilter]);

  const deleteFood = async (id) => {
    const { error } = await supabase.from('foods').delete().eq('id', id);
    if (error) {
      console.error(error);
      setMessage('❌ 刪除失敗');
    } else {
      setMessage('✅ 已刪除');
      fetchFoods();
    }
  };

  const updateFood = async () => {
    const { error } = await supabase
      .from('foods')
      .update({ name: editingName })
      .eq('id', editingId);

    if (error) {
      console.error(error);
      setMessage('❌ 更新失敗');
    } else {
      setMessage('✅ 已更新');
      setEditingId(null);
      setEditingName('');
      fetchFoods();
    }
  };

  return (
    <div className="p-4 mt-4 border-t">
      <h2 className="text-lg font-bold mb-2">🍽️ 我的食材列表</h2>

      <div className="flex items-center space-x-2 mb-2">
        <input
          className="border p-1"
          type="text"
          placeholder="搜尋食材名稱"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          className="border p-1"
          value={storageFilter}
          onChange={(e) => setStorageFilter(e.target.value)}
        >
          <option value="">全部儲存方式</option>
          <option value="冷藏">冷藏</option>
          <option value="冷凍">冷凍</option>
        </select>
      </div>

      {foods.map((food) => {
        const isExpired = new Date(food.expiry_date) < new Date();
        const isNearExpiry = new Date(food.expiry_date) <= new Date(Date.now() + 3 * 86400000);

        return (
          <div key={food.id} className="mb-2 border p-2 rounded flex items-center space-x-2">
            {editingId === food.id ? (
              <>
                <input
                  className="border p-1"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button className="bg-green-500 text-white px-2 py-1" onClick={updateFood}>儲存</button>
                <button className="bg-gray-300 px-2 py-1" onClick={() => setEditingId(null)}>取消</button>
              </>
            ) : (
              <>
                <span>{food.name}</span>
                <span className={`text-sm ${isExpired ? 'text-red-600' : isNearExpiry ? 'text-orange-500' : 'text-gray-500'}`}>
                  （過期日：{food.expiry_date}）
                </span>
                {food.storage && <span className="text-xs text-blue-500">[{food.storage}]</span>}
                <button className="text-blue-600 text-sm" onClick={() => {
                  setEditingId(food.id);
                  setEditingName(food.name);
                }}>✏️ 編輯</button>
                <button className="text-red-600 text-sm" onClick={() => deleteFood(food.id)}>🗑️ 刪除</button>
              </>
            )}
          </div>
        );
      })}
      {message && <div className="text-sm mt-2">{message}</div>}
    </div>
  );
}
