import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

async function packageShopr() {
  const rootDir = process.cwd();
  const shoprDir = path.join(rootDir, 'shopr');
  const zipPath = path.join(rootDir, 'shopr.zip');
  const publicZipPath = path.join(rootDir, 'public', 'shopr.zip');

  console.log('Packaging shopr production files into shopr.zip...');

  const zip = new AdmZip();
  
  // Add all files from shopr/ directly at the root of the zip
  // (Standard for cPanel/Hosting public_html deployment)
  if (fs.existsSync(shoprDir)) {
    zip.addLocalFolder(shoprDir, '');
  }

  // Also include firebase-rules.json at root of zip
  const rulesPath = path.join(rootDir, 'firebase-rules.json');
  if (fs.existsSync(rulesPath)) {
    zip.addLocalFile(rulesPath, '');
  }

  zip.writeZip(zipPath);
  console.log(`Successfully generated ${zipPath} (${fs.statSync(zipPath).size} bytes)`);

  // Sync to public directory for direct browser download
  if (!fs.existsSync(path.join(rootDir, 'public'))) {
    fs.mkdirSync(path.join(rootDir, 'public'), { recursive: true });
  }
  fs.copyFileSync(zipPath, publicZipPath);
  console.log(`Successfully synchronized to ${publicZipPath}`);
}

packageShopr().catch((err) => {
  console.error('Error creating shopr.zip:', err);
  process.exit(1);
});
