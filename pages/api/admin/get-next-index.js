import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const jaDir = path.join(process.cwd(), 'public/ja/artworks-data');

  // artworks-data フォルダがない場合は初回として index=1 を返す
  if (!fs.existsSync(jaDir)) {
    return res.status(200).json({ nextIndex: 1 });
  }

  const files = fs.readdirSync(jaDir);

  const indexes = files.map((file) => {
    try {
      const content = fs.readFileSync(path.join(jaDir, file), 'utf-8');
      return JSON.parse(content).index ?? 0;
    } catch {
      return 0;
    }
  });

  const maxIndex = Math.max(...indexes, 0);
  res.status(200).json({ nextIndex: maxIndex + 1 });
}