import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { page = 1, limit = 12 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const dataDir = path.join(process.cwd(), 'public/ja/artworks-data');
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));

  const artworks = files
    .map((file) => {
      const json = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
      return json;
    })
    .sort((a, b) => b.index - a.index); // ← ★ ここで大きい順に！

  const start = (pageNum - 1) * limitNum;
  const paginated = artworks.slice(start, start + limitNum);

  res.status(200).json({
    artworks: paginated,
    hasMore: start + limitNum < artworks.length,
  });
}