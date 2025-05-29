import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

type NewsItem = {
  index: number;
  slug: string;
  date: string;
  title: string;
};

type Props = {
  newsList: NewsItem[];
};

// 🔁 baseUrl は環境で切り替え
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLocale = locale || 'ja';

  const res = await fetch(`${baseUrl}/news/${currentLocale}/index.json`);
  const newsList: NewsItem[] = res.ok ? await res.json() : [];

  // オプション：indexでソート（降順）
  newsList.sort((a, b) => b.index - a.index);

  return {
    props: {
      ...(await serverSideTranslations(currentLocale, ['common'])),
      newsList,
    },
  };
};

export default function NewsIndex({ newsList }: Props) {
  const { t } = useTranslation('common');
  const { locale } = useRouter();

  return (
    <div className="max-w-3xl mx-auto p-4 pt-30">
      <h1 className="text-3xl font-bold mb-6">{t('nav.news')}</h1>
      <ul className="space-y-4">
        {newsList.map((item) => (
          <li key={item.slug}>
            <Link href={`/news/${item.slug}`} locale={locale}>
              <div className="block hover:text-cyan-400 transition border-b border-gray-600 pb-2">
                <p className="text-sm text-gray-400">{item.date}</p>
                <p className="text-lg font-semibold">{item.title}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}