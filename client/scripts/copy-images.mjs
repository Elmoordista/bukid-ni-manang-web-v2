import fs from 'fs';
import path from 'path';

const sourceDir = path.join(process.cwd(), 'attached_assets');
const targetDir = path.join(process.cwd(), 'public', 'images');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const imageMapping = {
  'att.2MRun9RLKOWwKu9bUyQrtTgPcMSdaE822OIN3RTVRVo_1759384034741.jpeg': 'main-tour.jpg',
  'att.FQnkvMMN9sySdgwtKNWSV7CPr3B2QMoVgepD_Z-02TM_1759418259559.jpeg': 'pool.jpg',
  'att.MOsXOmplcFEzEBxTfzLgpxdBPcSWEW64ro4oLAosNKU_1759418259559.jpeg': 'restaurant.jpg',
  'att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg': 'garden.jpg',
  'att.srwY8YGtXZDSoSl3Y8JR6q2OkWT5-aRf-EIDW6g-lhE_1759418259558.jpeg': 'amenity.jpg'
};

for (const [source, target] of Object.entries(imageMapping)) {
  const sourcePath = path.join(sourceDir, source);
  const targetPath = path.join(targetDir, target);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${source} to ${target}`);
  } else {
    console.log(`Source file ${source} not found`);
  }
}