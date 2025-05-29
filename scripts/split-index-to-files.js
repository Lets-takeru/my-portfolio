const fs = require('fs');
const path = require('path');

const locale = 'fr'; // 'en' や 'fr' に変えることで他言語にも対応できます
const dataDir = path.join(__dirname, `../public/${locale}/artworks-data`);
const indexFile = path.join(dataDir, 'index.json');

if (!fs.existsSync(indexFile)) {
  console.error('❌ index.json が見つかりません');
  process.exit(1);
}

// index.json を読み込み
const artworks = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));

// 1つずつファイルに出力
artworks.forEach((art) => {
  if (!art.slug) {
    console.warn('⚠️ slug がないアイテムがあるためスキップしました:', art);
    return;
  }

  const outputPath = path.join(dataDir, `${art.slug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(art, null, 2), 'utf-8');
  console.log(`✅ ${art.slug}.json を生成`);
});