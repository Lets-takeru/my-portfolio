//import fs from 'fs';
//import path from 'path';
//import formidable from 'formidable';

//export const config = {
 // api: {
   // bodyParser: false,
  //},
//};

//export default async function handler(req, res) {
  //if (req.method !== 'POST') return res.status(405).end();

  //const form = new formidable.IncomingForm();
 //form.uploadDir = path.join(process.cwd(), 'public/artworks');
 // form.keepExtensions = true;

 // form.parse(req, async (err, fields, files) => {
   // if (err) return res.status(500).json({ error: 'Form parse error' });

    //const {
     // title,
     // title_en,
     // title_fr,
      //description,
     // description_en,
     // description_fr,
     // tags,
     // index,
     // slug,
     // filename,
     // createdAt,
     // isPublic,
   // } = fields;

   // const file = files.file;
   // const newFilename = `${filename}.jpg`;
   // const imagePath = path.join(process.cwd(), 'public/artworks', newFilename);
   // fs.renameSync(file.filepath, imagePath);

    // 共通メタデータ
   // const baseMeta = {
    //  file: newFilename,
     // slug,
    //  index: parseInt(index),
      //createdAt,
     // tags: tags.split(',').map((t) => t.trim()),
    //  isPublic: isPublic === 'true' || isPublic === true,
   // };

    // 各言語のメタデータ
   // const metas = {
     // ja: {
      //  ...baseMeta,
      //  title,
      //  description,
     // },
     // en: {
      //  ...baseMeta,
      //  title: title_en || title,
      //  description: description_en || '',
     // },
      //fr: {
      //  ...baseMeta,
      //  title: title_fr || title,
      //  description: description_fr || '',
     // },
    //};

   // for (const locale of ['ja', 'en', 'fr']) {
    //  const dir = path.join(process.cwd(), 'public', locale, 'artworks-data');
   //   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

     // const filePath = path.join(dir, `${slug}.json`);
     // fs.writeFileSync(filePath, JSON.stringify(metas[locale], null, 2), 'utf-8');
    //}

    //res.status(200).json({ message: 'Saved to all locales' });
 // });
//}
