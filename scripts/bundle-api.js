import esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const entries = [
  { in: path.join(rootDir, 'server/project-enquiry.ts'), out: 'project-enquiry' },
  { in: path.join(rootDir, 'server/general-enquiry.ts'), out: 'general-enquiry' },
  { in: path.join(rootDir, 'server/internship.ts'), out: 'internship' },
  { in: path.join(rootDir, 'server/internship-application.ts'), out: 'internship-application' },
  { in: path.join(rootDir, 'server/admin/login.ts'), out: 'admin/login' },
  { in: path.join(rootDir, 'server/admin/leads.ts'), out: 'admin/leads' },
  { in: path.join(rootDir, 'server/admin/enquiries.ts'), out: 'admin/enquiries' },
  { in: path.join(rootDir, 'server/admin/internships.ts'), out: 'admin/internships' }
];

const apiDir = path.join(rootDir, 'api');
const adminDir = path.join(apiDir, 'admin');

if (!fs.existsSync(apiDir)) fs.mkdirSync(apiDir, { recursive: true });
if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });

async function bundle() {
  console.log('[BUNDLE] Bundling serverless functions for Vercel deployment...');
  
  for (const entry of entries) {
    const outfile = path.join(apiDir, `${entry.out}.js`);
    await esbuild.build({
      entryPoints: [entry.in],
      outfile,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      packages: 'external',
      logLevel: 'info'
    });
    console.log(`[BUNDLE] Created ${entry.out}.js`);
  }
  console.log('[BUNDLE] All Vercel serverless functions successfully bundled!');
}

bundle().catch(err => {
  console.error('[BUNDLE] Error bundling serverless functions:', err);
  process.exit(1);
});
