import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('admin-auth');
    if (stored === 'true') setAuthorized(true);
  }, []);

  const handleLogin = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: input }),
    });

    if (res.ok) {
      localStorage.setItem('admin-auth', 'true');
      setAuthorized(true);
    } else {
      alert('パスワードが違います');
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">管理者ログイン</h2>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="p-2 rounded bg-gray-700 border border-cyan-500 w-full mb-4"
            placeholder="パスワード"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded"
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">🎉 管理者ページへようこそ！</h1>

      <div className="flex flex-col gap-4 max-w-sm mx-auto">
        <Link href="/admin/artworks">
          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded text-lg font-semibold">
            編集一覧ページへ
          </button>
        </Link>

        <Link href="/admin/add">
          <button className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded text-lg font-semibold">
            作品追加ページへ
          </button>
        </Link>
      </div>
    </div>
  );
}