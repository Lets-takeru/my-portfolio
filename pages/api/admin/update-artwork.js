import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const {
      slug,
      file,
      title,
      title_en,
      title_fr,
      createdAt,
      index,
      tags,
      isPublic,
      description,
      description_en,
      description_fr,
    } = req.body;

   if (!slug) {
  return res.status(400).json({ error: 'Missing required field: slug' });
}

    // ✅ 共通メタデータ
    const baseMeta = {
      file,
      slug,
      createdAt,
      tags: Array.isArray(tags) ? tags : [],
      isPublic: isPublic === true || isPublic === 'true',
      index: parseInt(index), 
    };

    // ✅ 各言語ごとのデータ
    const metas = {
      ja: {
        ...baseMeta,
        title,
        description,
      },
      en: {
        ...baseMeta,
        title: title_en || title,
        description: description_en || '',
      },
      fr: {
        ...baseMeta,
        title: title_fr || title,
        description: description_fr || '',
      },
    };

    // ✅ 各ロケールに書き出し
    for (const locale of ['ja', 'en', 'fr']) {
      const dir = path.join(process.cwd(), 'public', locale, 'artworks-data');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const jsonPath = path.join(dir, `${slug}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(metas[locale], null, 2), 'utf-8');
    }

    return res.status(200).json({ message: 'Updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}