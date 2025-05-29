// pages/admin/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      alert('パスワードが間違っています');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="p-6 bg-gray-900 rounded shadow-md space-y-4">
        <h1 className="text-xl font-bold">管理ログイン</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          className="w-full p-2 border border-cyan-500 rounded bg-black text-white"
        />
        <button type="submit" className="w-full p-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white">
          ログイン
        </button>
      </form>
    </div>
  );
}