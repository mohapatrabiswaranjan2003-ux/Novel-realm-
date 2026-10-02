const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '../src/assets/images');

async function optimizeAll() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  console.log(`Found ${files.length} images to optimize in ${dir}...`);
  
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    beforeTotal += stat.size;

    // Check if it's a cover or wallpaper
    const isWallpaper = file.includes('library_bg');
    const width = isWallpaper ? 1440 : 540;
    const quality = isWallpaper ? 82 : 80;

    const tempPath = filePath + '.tmp';
    await sharp(filePath)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toFile(tempPath);

    const newStat = fs.statSync(tempPath);
    afterTotal += newStat.size;

    fs.renameSync(tempPath, filePath);
    console.log(`Optimized ${file}: ${(stat.size / 1024).toFixed(0)}KB -> ${(newStat.size / 1024).toFixed(0)}KB`);
  }

  console.log(`\n🎉 Total size reduced: ${(beforeTotal / 1024 / 1024).toFixed(2)}MB -> ${(afterTotal / 1024 / 1024).toFixed(2)}MB (${(((beforeTotal - afterTotal) / beforeTotal) * 100).toFixed(1)}% saved)`);
}

optimizeAll().catch(err => {
  console.error(err);
  process.exit(1);
});
