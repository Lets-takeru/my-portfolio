import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';

type Article = {
  index: number;
  slug: string;
  date: string;
  title: string;
  content: string;
  image?: string;
};

type Props = {
  article: Article;
};

// 🔁 本番・ローカル URL 自動切替
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://Lets-takeru/my-portfolio' // ✅ 本番URLに置き換えてください
    : 'http://localhost:3000';

export const getStaticPaths: GetStaticPaths = async () => {
  const locales = ['ja', 'en', 'fr'];
  const paths: { params: { slug: string }; locale: string }[] = [];

  for (const locale of locales) {
    const res = await fetch(`${baseUrl}/news/${locale}/index.json`);
    const list = res.ok ? await res.json() : [];

    list.forEach((item: Article) => {
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
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const currentLocale = locale || 'ja';
  const slug = params?.slug as string;

  const res = await fetch(`${baseUrl}/news/${currentLocale}/${slug}.json`);
  if (!res.ok) {
    return { notFound: true };
  }

  const article: Article = await res.json();

  return {
    props: {
      ...(await serverSideTranslations(currentLocale, ['common'])),
      article,
    },
  };
};

export default function NewsArticle({ article }: Props) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
        href="/news"
        className="pt-30 pr-0 text-cyan-400 hover:underline mb-4 inline-block z-50"
      >
        ← ニュース一覧へ戻る
      </Link>

      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{article.date}</p>

      {article.image && (
        <div className="mb-6">
          <Image
            src={`/images/${article.image}`}
            alt={article.title}
            width={800}
            height={450}
            className="rounded-md"
          />
        </div>
      )}

      <div className="whitespace-pre-line text-lg leading-relaxed">
        {article.content}
      </div>
    </div>
  );
}