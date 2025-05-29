import fs from 'fs';
import path from 'path';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { TAGS } from '@/data/tagData';

export async function getStaticPaths() {
  const dir = path.join(process.cwd(), 'public/ja/artworks-data');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

  const paths = files.map((file) => ({
    params: { slug: file.replace(/\.json$/, '') },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'public/ja/artworks-data', `${params.slug}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  return {
    props: { initialData: json },
  };
}

export default function EditArtwork({ initialData }) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData.title || '');
  const [slug, setSlug] = useState(initialData.slug || '');
  const [file, setFile] = useState(initialData.file || '');
  const [createdAt, setCreatedAt] = useState(initialData.createdAt?.split('T')[0] || '');
  const [tags, setTags] = useState(initialData.tags || []);
  const [isPublic, setIsPublic] = useState(initialData.isPublic ?? true);

  const [descJa, setDescJa] = useState(initialData.description || '');
  const [descEn, setDescEn] = useState(initialData.description_en || '');
  const [descFr, setDescFr] = useState(initialData.description_fr || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      slug,
      file,
      title,
      createdAt,
      tags,
      isPublic,
      description: descJa,
      description_en: descEn,
      description_fr: descFr,
    };

    const res = await fetch('/api/admin/update-artwork', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert('更新しました！');
      router.push('/admin/artworks');
    } else {
      alert('更新に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">作品の編集：{title}</h1>
        <button
          onClick={() => router.push('/admin/artworks')}
          className="text-sm px-3 py-1 border border-cyan-500 rounded hover:bg-cyan-600"
        >
          ← 戻る
        </button>
      </div>

      {file && (
        <div className="flex justify-center mb-6">
          <img
            src={`/artworks/${file}`}
            alt={title}
            className="w-60 h-60 object-cover rounded-lg border border-cyan-500"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        <label className="block text-sm text-gray-300">タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        />

        <label className="block text-sm text-gray-300">スラグ</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        />

        <label className="block text-sm text-gray-300">画像ファイル名</label>
        <input
          type="text"
          value={file}
          onChange={(e) => setFile(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        />

        <label className="block text-sm text-gray-300">制作日</label>
        <input
          type="date"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        />

        <label className="block text-sm text-gray-300">公開設定</label>
        <select
          value={isPublic ? 'true' : 'false'}
          onChange={(e) => setIsPublic(e.target.value === 'true')}
          className="w-full p-2 rounded bg-gray-800"
        >
          <option value="true">公開する</option>
          <option value="false">非公開にする</option>
        </select>

        <div>
          <p className="mb-1 text-sm text-gray-300">タグ（複数選択可）</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(TAGS).flat().map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() =>
                  setTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
                className={`px-3 py-1 rounded-full text-sm border ${
                  tags.includes(tag)
                    ? 'bg-cyan-500 border-cyan-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <label className="block text-sm text-gray-300">説明（日本語）</label>
        <textarea
          value={descJa}
          onChange={(e) => setDescJa(e.target.value)}
          rows={4}
          className="w-full p-2 rounded bg-gray-800"
        />

        <label className="block text-sm text-gray-300">Description (English)</label>
        <textarea
          value={descEn}
          onChange={(e) => setDescEn(e.target.value)}
          rows={4}
          className="w-full p-2 rounded bg-gray-800"
        />

        <label className="block text-sm text-gray-300">Description (Français)</label>
        <textarea
          value={descFr}
          onChange={(e) => setDescFr(e.target.value)}
          rows={4}
          className="w-full p-2 rounded bg-gray-800"
        />

        <button
          type="submit"
          className="w-full bg-cyan-600 py-2 rounded hover:bg-cyan-500"
        >
          更新する
        </button>
      </form>
    </div>
  );
}