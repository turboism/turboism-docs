import { readFile, writeFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderStaticHeader, staticHeaderScript } from '../brand/static-header.mjs';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(process.argv[2] || path.join(project, 'public/api/sdk'));
try { await access(root); } catch { console.log('No hosted SDK reference to style.'); process.exit(0); }
const brand = await readFile(path.join(project, 'brand/brand.css'), 'utf8') + '\n' + await readFile(path.join(project, 'brand/typography.css'), 'utf8');
const header = renderStaticHeader('sdk');
const adapter = `
body{margin:0}body>.flex-box{padding-top:var(--tb-header-height)}body:not(:has(>.flex-box)){padding-top:var(--tb-header-height)}
html{scroll-padding-top:calc(var(--tb-header-height) + 5rem)}
.tb-header a:link,.tb-header a:visited{color:var(--tb-muted)}.tb-header .tb-logo:link,.tb-header .tb-logo:visited,.tb-header a[aria-current=page]{color:var(--tb-violet)}
.top-nav{background:var(--tb-violet)}.sub-nav,.even-row-color{background:var(--tb-soft)}.odd-row-color{background:var(--tb-paper)}
.nav-bar-cell1-rev,.caption span,.table-tabs button.active-table-tab{background:var(--tb-yellow);color:var(--tb-ink)}
a:link,a:visited{color:var(--tb-violet)}.top-nav a:link,.top-nav a:visited{color:#fff}
`;
await writeFile(path.join(root, 'turboism-nav.js'), staticHeaderScript);
await writeFile(path.join(root, 'turboism-brand.css'), brand + adapter);
let count = 0;
async function visit(directory) {
 for (const entry of await readdir(directory, {withFileTypes:true})) {
  const file=path.join(directory, entry.name);
  if (entry.isDirectory()) { await visit(file); continue; }
  if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
  const original=await readFile(file,'utf8');
  if (!/<\/head>/i.test(original) || !/<body\b/i.test(original)) continue;
  let content=original.replace(/<link\b[^>]*data-turboism-style[^>]*>\s*/g,'').replace(/<nav\b[^>]*data-turboism-nav[\s\S]*?<\/nav>/g,'').replace(/<header\b[^>]*data-turboism-nav[\s\S]*?<\/header>/g,'').replace(/<script\b[^>]*data-turboism-script[^>]*>[\s\S]*?<\/script>\s*/g,'');
  const href=path.relative(path.dirname(file),path.join(root,'turboism-brand.css')).split(path.sep).join('/');
  const fontHref=href.replace('turboism-brand.css','turboism-fonts.css');
  const scriptHref=href.replace('turboism-brand.css','turboism-nav.js');
  content=content.replace(/<\/head>/i, `<link data-turboism-style rel="stylesheet" href="${fontHref}"><link data-turboism-style rel="stylesheet" href="${href}"><script data-turboism-script src="${scriptHref}" defer></script>\n</head>`);
  if (/<div class="flex-box">/.test(content)) content=content.replace('<div class="flex-box">',`<div class="flex-box">${header}`);
  else content=content.replace(/<body\b[^>]*>/i, value=>value+header);
  if (content!==original) await writeFile(file,content);
  count++;
 }
}
await visit(root);
console.log(`Styled ${count} SDK HTML pages; API content and reference URLs preserved.`);
