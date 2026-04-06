import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const MAX_SIZE_BYTES = 3.5 * 1024 * 1024; // 3.5MB

/**
 * CI: Build all brands and check budget.
 */
async function buildAll() {
  const brandsDir = path.join(root, 'src', 'brands');
  const brands = fs.readdirSync(brandsDir).filter(f => fs.statSync(path.join(brandsDir, f)).isDirectory());

  console.log(`[Build] Found ${brands.length} brands: ${brands.join(', ')}`);

  for (const brand of brands) {
    console.log(`\n>>> Building Brand: [${brand}]`);
    
    try {
      // Execute build with environment variable
      execSync(`npx cross-env VITE_BRAND=${brand} vite build`, { 
        cwd: root, 
        stdio: 'inherit' 
      });

      const outDir = path.join(root, 'dist', brand);
      const indexPath = path.join(outDir, 'index.html');
      const aloginPath = path.join(outDir, 'alogin.html');

      if (fs.existsSync(indexPath)) {
        // Rename to alogin.html for MikroTik
        fs.rename(indexPath, aloginPath, (err) => {
          if (err) throw err;
          
          // CHECK SIZE (CI Budget Control)
          const stats = fs.statSync(aloginPath);
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          
          if (stats.size > MAX_SIZE_BYTES) {
            console.error(`\x1b[31m[ERROR] Brand [${brand}] exceeds budget! Size: ${sizeMB}MB (Limit: 3.5MB)\x1b[0m`);
            process.exit(1);
          } else {
            console.log(`\x1b[32m[SUCCESS] Brand [${brand}] built successfully. Final size: ${sizeMB}MB\x1b[0m`);
          }
        });
      }
    } catch (err) {
      console.error(`[ERROR] Build failed for brand ${brand}`);
      process.exit(1);
    }
  }
}

buildAll();
