const fs = require('fs');
const path = require('path');

const locale = 'ja'; // ← 対象の言語（必要に応じて 'en', 'fr' にも対応可能）
const dataDir = path.join(__dirname, `../public/${locale}/artworks-data`);
const indexFile = path.join(dataDir, 'index.json');

if (!fs.existsSync(indexFile)) {
  console.error('❌ index.json が見つかりません');
  process.exit(1);
}

// index.json を読み込み
const artworks = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));

// 各アイテムを個別ファイルに分割（index値で保存）
artworks.forEach((art) => {
  if (typeof art.index !== 'number') {
    console.warn('⚠️ index がない or 数値でないためスキップしました:', art);
    return;
  }

  const outputPath = path.join(dataDir, `${art.index}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(art, null, 2), 'utf-8');
  console.log(`✅ ${art.index}.json を生成しました`);
});