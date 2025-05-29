import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import nookies from 'nookies';

export async function getServerSideProps(context) {
  const { req, res } = context;
  const cookies = nookies.get(context);

  if (cookies.admin_auth !== process.env.ADMIN_PASSWORD) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/admin/get-artworks?page=${page}&limit=12`);
      const { artworks: newData, hasMore } = await res.json();
      setArtworks((prev) => [...prev, ...newData]);
      setHasMore(hasMore);
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore]);

  const togglePublic = async (slug) => {
    const res = await fetch('/api/admin/toggle-public', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    if (!res.ok) return alert('切り替え失敗');

    const { isPublic } = await res.json();
    setArtworks((prev) =>
      prev.map((art) => (art.slug === slug ? { ...art, isPublic } : art))
    );
  };

  const filtered = artworks.filter((art) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      art.title?.toLowerCase().includes(term) ||
      String(art.index) === term
    );
  });

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">作品一覧</h1>

      <input
        type="text"
        placeholder="作品番号またはタイトルで検索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2 p-2 bg-gray-800 text-white border border-cyan-500 rounded mb-6"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((art) => (
          <div
            key={art.slug}
            className="bg-gray-800 rounded-lg shadow-md p-2 text-center transition hover:ring-2 hover:ring-cyan-500"
          >
            <Link href={`/admin/edit/${art.slug}`}>
              <img
                src={`/artworks/${art.file}`}
                alt={art.title}
                className="w-full h-32 object-cover rounded cursor-pointer"
              />
            </Link>
            <p className="mt-2 text-sm text-cyan-400">No.{art.index}</p>
            <p className="text-base font-semibold">{art.title}</p>
            <p className="text-sm text-gray-400">{art.createdAt?.split('T')[0]}</p>
            <button
              onClick={() => togglePublic(art.slug)}
              className={`mt-2 px-2 py-1 text-sm rounded-full transition ${
                art.isPublic ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              {art.isPublic ? '公開中' : '非公開'}
            </button>
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="h-10 mt-10 flex justify-center items-center">
        {hasMore && <p className="text-gray-400">読み込み中...</p>}
      </div>

      {!filtered.length && (
        <p className="text-center text-gray-400 mt-10">該当する作品が見つかりません</p>
      )}
    </div>
  );
}