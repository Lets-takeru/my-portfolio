
import { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';



export async function getStaticProps({ locale }) {
  const currentLocale = locale || 'ja';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // まとめて用意されたJSONをfetch
  const res = await fetch(`${baseUrl}/${currentLocale}/artworks-data/index.json`);
  const metadataList = res.ok ? await res.json() : [];

  // 公開されているものだけに絞る
  const imageDetails = metadataList
    .filter((meta) => meta.isPublic)
    .map((meta) => ({
      file: meta.file,
      title: meta.title,
      description: meta.description,
      index: meta.index,
      slug: meta.slug,
      createdAt: meta.createdAt,
      tags: meta.tags,
      detailPageUrl: `/works/${meta.slug}`,
    }))
    .sort((a, b) => b.index - a.index); // 新しい順

  return {
    props: {
      ...(await serverSideTranslations(currentLocale, ['common'])),
      allImages: imageDetails,
    },
  };
}

export default function ArtworksPage({ allImages }) {
  const [visibleImages, setVisibleImages] = useState(10);
  const [inputTerm, setInputTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [likesMap, setLikesMap] = useState({});
  const [likedMap, setLikedMap] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const newLikes = {};
    const newLiked = {};
    allImages.forEach((image) => {
      const storedLikes = localStorage.getItem(`like-${image.slug}`);
      const hasLiked = localStorage.getItem(`liked-${image.slug}`) === 'true';
      newLikes[image.slug] = storedLikes ? parseInt(storedLikes) : 0;
      newLiked[image.slug] = hasLiked;
    });
    setLikesMap(newLikes);
    setLikedMap(newLiked);
  }, [allImages]);

  const handleLike = (slug) => {
    if (likedMap[slug]) return;
    const newLikes = { ...likesMap, [slug]: (likesMap[slug] || 0) + 1 };
    const newLiked = { ...likedMap, [slug]: true };
    setLikesMap(newLikes);
    setLikedMap(newLiked);
    localStorage.setItem(`like-${slug}`, newLikes[slug]);
    localStorage.setItem(`liked-${slug}`, 'true');
  };

  const handleSearch = () => {
    setSearchTerm(inputTerm.trim());
    setVisibleImages(10);
  };

  const handleReset = () => {
    setInputTerm('');
    setSearchTerm('');
    setVisibleImages(10);
    setSelectedTags([]);
  };

  const handleScroll = () => {
    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 200;
    if (bottom) {
      setVisibleImages((prev) => prev + 10);
    }
  };

  const allTags = Array.from(
  new Set(allImages.flatMap((img) => img.tags || []))
);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toHalfWidth = (str) =>
    str.replace(/[０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );

  const filteredImages = allImages.filter((image) => {
  const keyword = toHalfWidth(searchTerm);

  const matchText =
    /^\d+$/.test(keyword)
      ? image.index === Number(keyword)
      : image.title.includes(keyword) || image.description.includes(keyword);

  const matchTags =
  selectedTags.length === 0 ||
  selectedTags.every((tag) => image.tags?.includes(tag));

return matchText && matchTags;
});

  return (
    <div className="bg-transparent min-h-screen">
      

      <div className="p-8 pt-24" id="portfolio">
        <h1 className="text-white text-center text-3xl mb-8">Artworks Gallery</h1>

        {/* 🔍 検索エリア */}
        <div className="flex justify-center items-center mb-8 gap-4">
          <input
  type="text"
  placeholder="タイトル・説明 または 番号で検索"
  value={inputTerm}
  onChange={(e) => setInputTerm(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSearch(); // ← Enterキーで検索を実行
    }
  }}
  className="px-4 py-2 rounded bg-gray-800 text-white w-80"
/>
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded"
          >
            検索
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            リセット
          </button>
        </div>

        {/* 🔍 タグで絞り込み */}
{allTags.length > 0 && (
  <div className="flex flex-wrap justify-center gap-4 mb-8">
    {allTags.map((tag, idx) => {
  const isSelected = selectedTags.includes(tag);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <button
      key={idx}
      onClick={() => toggleTag(tag)}
      className="flex items-center gap-2 text-base px-3 py-1 rounded-full border border-transparent hover:border-cyan-400 transition"
    >
      <span
        className={`w-3 h-3 rounded-full border-2 transition ${
          isSelected ? 'bg-black border-white' : 'border-gray-400'
        }`}
      />
      <span className="text-black">#{tag}</span>
    </button>
  );
})}
  </div>
)}

        

        {/* 🔳 ギャラリー */}
        <div className="grid grid-cols-4 gap-x-8 gap-y-12">
          {filteredImages.slice(0, visibleImages).map((image) => (
            <div
  key={image.file}
  className="bg-gray-900 rounded-lg shadow-md p-4 flex flex-col items-center text-white relative"
  
  
>
  {image.createdAt && (
  <span className="absolute top-4 right-2 text-xs text-white h-50">
    {image.createdAt}
  </span>
)}
  {/* 左側：画像 */}
  <Image
  src={`/artworks/${image.file}`} // public/artworks/ にあるファイル
  alt={image.file}
  width={144} // 36 * 4 (Tailwindのrem単位換算: 1rem = 16px)
  height={144}
  className="object-cover rounded-md border border-cyan-400"
/>

  {/* 右側：情報 */}
  <div className="flex flex-col justify-between text-white flex-1">
    <div className="mb-2">
      <p className="text-base text-gray-300">No. {image.index}</p>
      <h2 className="text-2xl font-extrabold">{image.title}</h2>

      <p className="text-sm text-gray-400 mt-1">
    {image.description.slice(0, 30)}...
  </p>
    </div>
    

    <div className="mt-auto flex justify-center gap-3 pt-2">
      
      <button
        onClick={() => handleLike(image.slug)}
        disabled={likedMap[image.slug]}
        className={`px-3 py-1 rounded text-sm ${
          likedMap[image.slug]
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-pink-500 hover:bg-pink-400'
        }`}
      >
        ❤️ {likesMap[image.slug] || 0}
      </button>

  <Link
  href={image.detailPageUrl}
  className="text-sm bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded transition self-center"
>
  もっと詳しく
</Link>
    </div>
    {image.tags && (
    <div className="w-full mt-4 flex flex-wrap max-w-full gap-2 justify-start">
      {image.tags.map((tag, idx) => (
        <span
          key={idx}
          className="inline-block bg-cyan-700 text-white text-xs px-2 py-1 roundedbreak-words"
        >
          #{tag}
        </span>
      ))}
    </div>
  )}
  </div>
</div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .image-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .image-details {
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .gap-x-8 {
          grid-column-gap: 2rem;
        }
        .gap-y-12 {
          grid-row-gap: 3rem;
        }
      `}</style>
    </div>
  );
}