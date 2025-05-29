// pages/works/[slug].js
import { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { tagColors } from '@/data/tagData';

export async function getStaticPaths() {
  const locales = ['ja', 'en', 'fr'];
 const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const paths = [];

  for (const locale of locales) {
    const res = await fetch(`${baseUrl}/${locale}/artworks-data/index.json`);
    const list = res.ok ? await res.json() : [];

    list
      .filter((item) => item.isPublic && item.slug)
      .forEach((item) => {
        paths.push({
          params: { slug: item.slug },
          locale,
        });
      });
  }

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params, locale }) {
  const currentLocale = locale || 'ja';

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://Lets-takeru/my-portfolio'
      : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/${currentLocale}/artworks-data/index.json`);
  const allData = res.ok ? await res.json() : [];

  const artwork = allData.find((art) => art.slug === params.slug);

  if (!artwork || artwork.isPublic === false) {
    return { notFound: true };
  }

  return {
    props: {
      ...(await serverSideTranslations(currentLocale, ['common'])),
      artwork,
    },
  };
}

export default function ArtworkPage({ artwork }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!artwork) return;

    const storedLikes = localStorage.getItem(`like-${artwork.slug}`);
    const hasLiked = localStorage.getItem(`liked-${artwork.slug}`) === 'true';

    if (storedLikes) setLikes(parseInt(storedLikes));
    if (hasLiked) setLiked(true);
  }, [artwork]);

  const handleLike = () => {
    if (liked || !artwork) return;
    const newLikes = likes + 1;
    setLikes(newLikes);
    setLiked(true);
    localStorage.setItem(`like-${artwork.slug}`, newLikes);
    localStorage.setItem(`liked-${artwork.slug}`, 'true');
  };

  if (!artwork) {
    return <div className="text-white p-8">作品が見つかりません。</div>;
  }

  return (
    <div className="bg-transparent text-white min-h-screen">
      <div className="pt-20 p-8 max-w-5xl mx-auto">
        {/* 上部ボタン */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <Link
  href="/artworks"
  className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-500 transition text-base"
>
  一覧に戻る
</Link>

          <button
            onClick={handleLike}
            disabled={liked}
            className={`px-4 py-2 rounded transition text-base ${
              liked ? 'bg-gray-600 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-400'
            }`}
          >
            ❤️ {likes}
          </button>

          <Link
  href="/"
  className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-500 transition text-base"
>
  トップに戻る
</Link>
        </div>

        {/* メイン：画像 + 情報 */}
        <div className="bg-slate-800 rounded-xl shadow-xl p-6 mt-12 flex flex-col md:flex-row gap-8 items-start">
          {/* 左：画像 */}
          <img
            src={`/artworks/${artwork.file}`}
            alt={artwork.title}
            className="rounded-lg shadow-lg"
            style={{ width: '400px', height: 'auto' }}
          />

          {/* 右：情報 */}
          <div className="text-left w-full">
            <p className="text-sm text-cyan-400 mb-2">No. {artwork.index + 1}</p>
            <h1 className="text-3xl font-extrabold mb-2">{artwork.title}</h1>
            {artwork.createdAt && (
              <p className="text-xs text-gray-400 mb-4">制作日: {artwork.createdAt}</p>
            )}
            <p className="text-base leading-relaxed text-gray-300 whitespace-pre-line mb-4">
              {artwork.description}
            </p>
            {artwork.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {artwork.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${tagColors[tag] || 'bg-gray-600'}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}