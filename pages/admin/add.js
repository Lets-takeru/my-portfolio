import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TAGS } from '@/data/tagData';

const tagList = Object.values(TAGS).flat();

export default function AddArtwork() {
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [descriptionJa, setDescriptionJa] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nextIndex, setNextIndex] = useState(null);
  const [filename, setFilename] = useState('');
  const [slug, setSlug] = useState('');
  const [createdAt, setCreatedAt] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [isPublic, setIsPublic] = useState(true); // ✅ 追加
  const router = useRouter();

  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const res = await fetch('/api/admin/get-next-index');
        const data = await res.json();
        setNextIndex(data.index);
      } catch (err) {
        console.error('Failed to fetch index:', err);
      }
    };
    fetchIndex();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !descriptionJa || !filename || !slug) {
      alert('必須項目が足りません');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);
    formData.append('slug', slug);
    formData.append('title', title);
    formData.append('title_en', titleEn);
    formData.append('title_fr', titleFr);
    formData.append('description', descriptionJa);
    formData.append('description_en', descriptionEn);
    formData.append('description_fr', descriptionFr);
    formData.append('tags', tags.join(','));
    formData.append('index', nextIndex);
    formData.append('createdAt', createdAt);
    formData.append('isPublic', isPublic); // ✅ 追加

    const res = await fetch('/api/admin/upload-artwork', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('保存完了！');
      router.push('/admin/artworks');
    } else {
      alert('保存に失敗しました');
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">作品を追加</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">

        {/* 🔽 番号とファイル選択 */}
        <div className="flex flex-col md:flex-row items-start gap-4">
          {nextIndex !== null ? (
            <p className="text-cyan-400">作品番号（自動）：No.{nextIndex}</p>
          ) : (
            <p className="text-red-400">作品番号を読み込み中...</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-white"
            required
          />
        </div>

        {/* 🔽 プレビュー画像 */}
        {previewUrl && (
          <div className="flex justify-center">
            <img
              src={previewUrl}
              alt="プレビュー"
              className="w-[300px] h-[300px] object-cover rounded-xl border-4 border-cyan-500 shadow-xl"
            />
          </div>
        )}

        {/* 🔽 タイトル・翻訳 */}
        <input
          type="text"
          placeholder="タイトル（共通）"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
          required
        />
        <input
          type="text"
          placeholder="Title (English)"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
        />
        <input
          type="text"
          placeholder="Titre (Français)"
          value={titleFr}
          onChange={(e) => setTitleFr(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
        />

        {/* 🔽 説明欄 */}
        <textarea
          placeholder="説明（日本語）"
          value={descriptionJa}
          onChange={(e) => setDescriptionJa(e.target.value)}
          rows={4}
          className="w-full p-3 bg-gray-800 rounded"
          required
        />
        <textarea
          placeholder="Description (English)"
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
          rows={4}
          className="w-full p-3 bg-gray-800 rounded"
        />
        <textarea
          placeholder="Description (Français)"
          value={descriptionFr}
          onChange={(e) => setDescriptionFr(e.target.value)}
          rows={4}
          className="w-full p-3 bg-gray-800 rounded"
        />

        {/* 🔽 タグ */}
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-2">タグを選択（複数可）</p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {tagList.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
                className={`px-3 py-1 rounded-full border text-sm transition ${
                  tags.includes(tag)
                    ? 'bg-cyan-500 text-white border-cyan-500'
                    : 'bg-gray-700 text-gray-300 border-gray-500 hover:bg-gray-600'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* 🔽 制作日 */}
        <input
          type="date"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
        />

        {/* 🔽 ファイル名・スラグ */}
        <input
          type="text"
          placeholder="保存ファイル名（拡張子不要）"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
          required
        />
        <input
          type="text"
          placeholder="スラグ名（URLに使用）"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded"
          required
        />

        {/* ✅ 公開・非公開 */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
          <span>公開する</span>
        </label>

        {/* 🔽 送信ボタン */}
        <button
          type="submit"
          className="w-full bg-cyan-600 py-2 text-lg font-semibold rounded hover:bg-cyan-500"
          disabled={nextIndex === null}
        >
          登録
        </button>
      </form>
    </div>
  );
}