import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/router';
import HeroMessage from '@/components/HeroMessage';
import { heroMessage as jaMessage } from '@/localizedMessages/ja';
import { heroMessage as enMessage } from '@/localizedMessages/en';
import { heroMessage as frMessage } from '@/localizedMessages/fr';
import Link from 'next/link';
import Image from 'next/image';

export async function getStaticProps({ locale }) {
  
  const currentLocale = locale || 'ja';

  const baseUrl = 'https://my-portfolio-two-hazel-27.vercel.app';

  // ニュース一覧を取得
  let newsList = [];
  try {
    const newsRes = await fetch(`${baseUrl}/news/${currentLocale}/index.json`);
    if (newsRes.ok) {
      const newsAll = await newsRes.json();
      newsList = newsAll.sort((a, b) => b.index - a.index).slice(0, 3);
    } else {
      console.warn('❗ news/index.json fetch failed:', newsRes.status);
    }
  } catch (err) {
    console.error('❌ Error fetching news index:', err);
  }

  // アート作品一覧を取得
  let metadataList = [];
  try {
    const artworksRes = await fetch(`${baseUrl}/${currentLocale}/artworks-data/index.json`);
    if (artworksRes.ok) {
      const allMeta = await artworksRes.json();
      console.log("🎨 allMeta raw:", allMeta); 
      metadataList = allMeta.filter(meta => meta.isPublic);
      console.log("🧾 metadataList:", metadataList);
    } else {
      console.warn('❗ artworks/index.json fetch failed:', artworksRes.status);
    }
  } catch (err) {
    console.error('❌ Error fetching artworks index:', err);
  }

  return {
    props: {
      ...(await serverSideTranslations(currentLocale, ['common'])),
      allImages: metadataList.map((meta) => meta.file),
      metadataList,
      newsList,
    },
  };
}

export default function Home({ allImages, metadataList, newsList }) {
  const [images, setImages] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMetadata, setSelectedMetadata] = useState(null);
  const [closing, setClosing] = useState(false);
  const [entered, setEntered] = useState(false);
  const [heroHidden, setHeroHidden] = useState(false);
  const [checkedSessionStorage, setCheckedSessionStorage] = useState(false);
  const { locale } = useRouter();

  const messageMap = { ja: jaMessage, en: enMessage, fr: frMessage };
  const message = messageMap[locale] || jaMessage;



  useEffect(() => {
    const hasEntered = sessionStorage.getItem('hasEntered') === 'true';
    setEntered(hasEntered);
    setHeroHidden(hasEntered);
    setCheckedSessionStorage(true);
  }, []);

  useEffect(() => {
    if (!checkedSessionStorage) return;
    document.body.style.overflow = entered ? 'auto' : 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [entered, checkedSessionStorage]);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => setHeroHidden(true), 1000);
    sessionStorage.setItem('hasEntered', 'true');
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 1200);
  };

  const createImageObject = (file) => {
    if (!file) return null; 
    const isUp = Math.random() > 0.5;
    const isMobile = window.innerWidth <= 768;
    const depth = isMobile ? Math.random() * 0.1 + 0.4 : Math.random() * 0.7 + 0.5;
    const speed = (Math.random() * 0.1 + 0.16) * depth;
    const topPx = Math.floor(Math.random() * window.innerHeight * 1.6);
    return {
      id: crypto.randomUUID(),
      file,
      topPx,
      left: `${10 + Math.floor(Math.random() * 70)}vw`,
      direction: isUp ? 'up' : 'down',
      scale: depth,
      speed,
      zIndex: Math.floor(depth * 10) + 10,
      fading: false,
      createdAt: Date.now(),
      lifespan: 15000 + Math.random() * 15000,
    };
  };

  useEffect(() => {
    console.log("🖼️ allImages:", allImages);
  if (allImages.length === 0) return; // ← 画像が1枚もないならスキップ

  const initial = Array.from({ length: 20 }, () => {
    const file = allImages[Math.floor(Math.random() * allImages.length)];
    if (!file) return null;
    return createImageObject(file);
  }).filter(Boolean); // ← null を除外

  setImages(initial);
}, [allImages]);

  useEffect(() => {
    let animationId;
    const animate = () => {
      if (!isPaused) {
        setImages((prev) =>
          prev.flatMap((img) => {
            const now = Date.now();
            if (!img) return [];
            const delta = img.direction === 'up' ? -img.speed : img.speed;
            const newTopPx = img.topPx + delta;
            const imgHeight = img.scale * 9 * 16;
            const isOutOfView = newTopPx + imgHeight < 0 || newTopPx > window.innerHeight * 1.6;
            const isExpired = now - img.createdAt > img.lifespan;
            if ((isOutOfView || isExpired) && !img.fading) {
              setTimeout(() => {
                setImages((curr) => curr.filter((i) => i.id !== img.id));
              }, 2000);
              return [{ ...img, topPx: newTopPx, fading: true }];
            }
            return [{ ...img, topPx: newTopPx }];
          })
        );
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;
      const newImages = Array.from({ length: 2 }, () => {
        const file = allImages[Math.floor(Math.random() * allImages.length)];
        return createImageObject(file);
      });
      setImages((prev) => [...prev, ...newImages]);
    }, 1500);
    return () => clearInterval(interval);
  }, [allImages, isPaused]);

  const handleImageClick = (file) => {
    const meta = metadataList.find((m) => m.file === file);
    if (file && meta) {
      setSelectedImage(file);
      setSelectedMetadata(meta);
      setClosing(false);
    }
  };

  const handleClosePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setSelectedImage(null);
      setSelectedMetadata(null);
    }, 400);
  };

  return (
    <div className="w-screen bg-transparent text-white overflow-x-hidden min-h-screen relative">
      {!heroHidden && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-white text-center bg-black/40 backdrop-blur-md transition-opacity duration-1000 ${entered ? 'opacity-0' : 'opacity-100'}`}
          onClick={handleEnter}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Let.s_la_vie_art</h1>
          <p className="text-base md:text-xl text-cyan-200 mb-4">感性と色彩の漂う空間へようこそ</p>
          <p className="text-sm text-gray-300 animate-blink">クリックして中へ入る</p>
        </div>
      )}

      <div className="h-screen relative z-0">
        {entered && (
          <>
            <div className="absolute top-[60%] left-6 right-6 z-50 text-left pointer-events-auto select-none">
              <HeroMessage message={message} />
            </div>

            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center text-white">
              <p className="text-sm md:text-sm mb-2 font-bold drop-shadow">作品をクリック！</p>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-4 py-1 rounded font-semibold border ${isPaused ? 'bg-cyan-600 text-white' : 'bg-white text-black'}`}
              >
                {isPaused ? '再開' : '停止'}
              </button>
            </div>
          </>
        )}

        {images
  .filter((img) => img !== null && img !== undefined)
  .map((img) => (
    <div
      key={img.id}
      className={`absolute ${img.fading ? 'fade-out' : 'fade-in'}`}
      style={{
        top: `${img.topPx}px`,
        left: img.left,
        zIndex: img.zIndex,
        width: `${img.scale * 9}rem`,
        height: `${img.scale * 9}rem`,
        pointerEvents: 'auto',
        cursor: 'pointer',
      }}
      onClick={() => handleImageClick(img.file)}
    >
      <Image
  src={`/artworks/${img.file}`}
  alt="art"
  width={300} // 例: 動的サイズがわからない場合、仮サイズを指定
  height={300}
  className="object-cover rounded-md border border-cyan-400 shadow-lg"
  style={{ width: '100%', height: '100%' }}
  draggable={false}
/>
    </div>
))}

        {selectedImage && selectedMetadata && (
          <div
             key={`${selectedImage}-${closing}`} 
            className={`absolute z-50 transition-transform duration-500 ease-out ${closing ? 'animate-slideout' : 'animate-slidein'} bg-black text-white p-4 rounded-2xl shadow-xl flex items-center gap-4 top-24 right-4 w-[80%] max-w-md h-[200px] transform scale-40 sm:scale-100 origin-top-right`}
            style={{ boxShadow: '0 4px 30px rgba(255, 255, 255, 0.3)' }}
          >
            <Image
  src={`/artworks/${selectedImage}`}
  alt={selectedMetadata.title}
  width={160}
  height={200} // 目安サイズ。正確な高さがわかる場合は調整可
  className="rounded-md object-cover border border-cyan-400"
  style={{ height: '100%' }}
/>
            <div className="flex flex-col justify-between h-full flex-grow py-1">
              <div>
                <p className="text-xl font-semibold text-cyan-400">No.{selectedMetadata.index + 1}</p>
                <p className="text-4xl font-bold">{selectedMetadata.title}</p>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <LikeButton slug={selectedMetadata.slug} /> {/* ← ✅ 追加 */}
              <Link
  href={`/works/${selectedMetadata.slug}`}
  className="text-sm bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded transition self-center"
>
  もっと詳しく
</Link>

              </div>
            </div>
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-400 hover:text-cyan-600 transition"
              aria-label="閉じる"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .fade-in { animation: fadeIn 2s ease forwards; }
        .fade-out { animation: fadeOut 2s ease forwards; }
        @keyframes slidein {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideout {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        .animate-slidein { animation: slidein 0.4s ease-out forwards; }
        .animate-slideout { animation: slideout 0.4s ease-in forwards; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-blink { animation: blink 2.4s infinite; }
      `}</style>

      {entered && (
        <div className="relative z-50 max-w-4xl mx-auto mt-32 px-4">
          <h2 className="text-2xl font-bold mb-4 text-white">最新ニュース</h2>
          <ul className="space-y-2">
            {newsList.map((news) => (
              <li key={news.slug}>
                <a href={`/news/${news.slug}`} className="text-cyan-400 hover:underline block border-b border-gray-600 pb-2">
                  <p className="text-sm text-gray-400">{news.date}</p>
                  <p className="text-lg font-semibold text-white">{news.title}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function LikeButton({ slug }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const storedLikes = localStorage.getItem(`like-${slug}`);
    const hasLiked = localStorage.getItem(`liked-${slug}`) === 'true';
    if (storedLikes) setLikes(parseInt(storedLikes));
    if (hasLiked) setLiked(true);
  }, [slug]);

  const handleLike = () => {
    if (liked) return;
    const newLikes = likes + 1;
    setLikes(newLikes);
    setLiked(true);
    localStorage.setItem(`like-${slug}`, newLikes);
    localStorage.setItem(`liked-${slug}`, 'true');
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`px-2 py-1 rounded text-xs transition ${liked ? 'bg-red-500 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-400'}`}
    >
      ❤️  {likes}
    </button>
  );
}