import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { slug } = req.body;

  if (!slug) {
    return res.status(400).json({ error: 'Missing slug' });
  }

  const locales = ['ja', 'en', 'fr'];
  let updated = false;

  try {
    for (const locale of locales) {
      const filePath = path.join(
        process.cwd(),
        'public',
        locale,
        'artworks-data',
        `${slug}.json`
      );

      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      // トグル
      data.isPublic = !data.isPublic;

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      updated = data.isPublic; // 最後に更新された状態を返す
    }

    return res.status(200).json({ isPublic: updated });
  } catch (err) {
    console.error('Toggle error:', err);
    return res.status(500).json({ error: 'Failed to toggle' });
  }
}