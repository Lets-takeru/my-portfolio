import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

// 各言語のデータを読み込み
import { profileData as ja } from '../data/profile/ja';
import { profileData as en } from '../data/profile/en';
import { profileData as fr } from '../data/profile/fr';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
    },
  };
}

export default function ProfilePage({ locale }) {
  const dataMap = { ja, en, fr };
  const data = dataMap[locale] || ja;

  return (
    <div className="bg-transparent min-h-screen text-white">
      <div className="pt-24 px-8 max-w-3xl mx-auto">

        {/* タイトル */}
        <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

        {/* プロフィール画像 */}
        <img
          src={data.image}
          alt="プロフィール画像"
          className="rounded-full mx-auto mb-4 shadow-lg"
          style={{ width: '180px', height: '180px', objectFit: 'cover' }}
        />

        {/* 🔻ここに見出しを追加 */}
        <h2 className="text-xl font-semibold mb-4 text-center text-black">
          Let.s_la_vie_art
        </h2>

        {/* 説明文（複数段落） */}
        {Array.isArray(data.description) ? (
  data.description.map((item, index) => (
    <p key={index}>{item}</p>
  ))
) : (
  <p>{data.description}</p>
)}

        {/* 🔻説明文の後に画像と説明を追加 */}
        <div className="mt-10 text-left">
          <img
            src="/images/art0.jpg" // あなたの画像パスに変更
            alt="代表作品"
            className="w-full max-w-md mx-auto mb-4 rounded shadow"
          />
          <h2 className="text-xl font-semibold mb-2 text-black">林武輝　HAYASHI TAKERU</h2>
          <p className="text-black text-md whitespace-pre-line">
            神奈川県横浜市出身
            2024年より黒い漢字に色を付けるデジタル漢字アートの制作を始める。
          </p>
          
        </div>

        {/* 活動歴 */}
        <h2 className="text-2xl font-semibold mt-12 mb-2 text-black">
          {locale === 'ja' ? '活動歴' : locale === 'fr' ? 'Historique' : 'Career'}
        </h2>
        <ul className="list-disc list-inside text-black text-left">
          {data.history.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        {/* SNS */}
        <h2 className="text-2xl font-semibold mt-8 mb-2 text-black">SNS</h2>
        <ul className="text-blue-400 underline">
          {data.sns.map((item, idx) => (
            <li key={idx}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}