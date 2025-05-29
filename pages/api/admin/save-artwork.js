// pages/api/admin/save-artwork.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method not allowed');
  }

  const { filename, content } = req.body;
  const filePath = path.join(process.cwd(), 'public/ja/artworks-data', filename);

  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    res.status(200).json({ message: 'saved' });
  } catch (err) {
    res.status(500).json({ error: 'failed to save', details: err.message });
  }
}