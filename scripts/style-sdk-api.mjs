import { readFile, writeFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(process.argv[2] || path.join(project, 'public/api/sdk'));
try { await access(root); } catch { console.log('No hosted SDK reference to style.'); process.exit(0); }
const brand = await readFile(path.join(project, 'brand/brand.css'), 'utf8');
const header = '<nav data-turboism-nav class="tb-sdk-nav" aria-label="Turboism sites"><a class="tb-logo" href="https://turboism.dev/">Turboism.</a><a href="https://turboism.dev/docs">Docs</a><a href="https://turboism.dev/sdk/index.html" aria-current="page">SDK</a><a href="https://turboism.dev/plugins">Plugins</a><a href="https://turboism.dev/learn">Learn</a><a href="https://chat.turboism.dev">Chat</a><a href="https://thanks.turboism.dev/thanks">Thanks</a><a href="https://turboism.dev/download">Download</a><a class="tb-icon" href="https://discord.gg/bect4anknH" target="_blank" rel="noopener noreferrer" aria-label="Turboism Discord"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 4.4a19.8 19.8 0 0 0-4.9-1.5l-.6 1.2a18.3 18.3 0 0 0-5.4 0l-.6-1.2a19.8 19.8 0 0 0-4.9 1.5C.8 9-.1 13.4.4 17.9a19.8 19.8 0 0 0 6 3l1.3-2.1-1.9-.9.5-.4a14.2 14.2 0 0 0 11.6 0l.5.4-1.9.9 1.3 2.1a19.8 19.8 0 0 0 6-3c.4-5.2-.9-9.6-3.5-13.5ZM8.2 15.1c-1.2 0-2.1-1-2.1-2.3s.9-2.3 2.1-2.3 2.1 1 2.1 2.3-.9 2.3-2.1 2.3Zm7.6 0c-1.1 0-2.1-1-2.1-2.3s1-2.3 2.1-2.3 2.1 1 2.1 2.3-1 2.3-2.1 2.3Z"/></svg></a><a class="tb-icon" href="https://github.com/turboism/Turboism" target="_blank" rel="noopener noreferrer" aria-label="Turboism GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.3-.2-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .9-.2 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.2 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.8-2.4 4.7-4.6 4.9.4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg></a></nav>';
const adapter = '\n.tb-sdk-nav{display:flex;align-items:center;gap:18px;flex-wrap:wrap;flex-shrink:0;padding:14px 24px;border-bottom:1px solid var(--tb-border);background:var(--tb-paper);font:13px var(--tb-sans)}.tb-sdk-nav a{color:var(--tb-violet);text-decoration:none}.tb-sdk-nav .tb-logo{margin-right:auto}.tb-sdk-nav a[aria-current=page]{box-shadow:0 3px var(--tb-yellow)}.top-nav{background:var(--tb-violet)}.sub-nav,.even-row-color{background:var(--tb-soft)}.odd-row-color{background:var(--tb-paper)}.nav-bar-cell1-rev,.caption span,.table-tabs button.active-table-tab{background:var(--tb-yellow);color:var(--tb-ink)}a:link,a:visited{color:var(--tb-violet)}.top-nav a:link,.top-nav a:visited{color:#fff}.tb-sdk-nav .tb-logo{color:var(--tb-violet)}';
await writeFile(path.join(root, 'turboism-brand.css'), brand + adapter);
let count = 0;
async function visit(directory) {
 for (const entry of await readdir(directory, {withFileTypes:true})) {
  const file=path.join(directory, entry.name);
  if (entry.isDirectory()) { await visit(file); continue; }
  if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
  const original=await readFile(file,'utf8');
  if (!/<\/head>/i.test(original) || !/<body\b/i.test(original)) continue;
  let content=original.replace(/<link\b[^>]*data-turboism-style[^>]*>\s*/g,'').replace(/<nav\b[^>]*data-turboism-nav[\s\S]*?<\/nav>/g,'');
  const href=path.relative(path.dirname(file),path.join(root,'turboism-brand.css')).split(path.sep).join('/');
  content=content.replace(/<\/head>/i, `<link data-turboism-style rel="stylesheet" href="${href}">\n</head>`);
  if (/<div class="flex-box">/.test(content)) content=content.replace('<div class="flex-box">',`<div class="flex-box">${header}`);
  else content=content.replace(/<body\b[^>]*>/i, value=>value+header);
  if (content!==original) await writeFile(file,content);
  count++;
 }
}
await visit(root);
console.log(`Styled ${count} SDK HTML pages; API content and reference URLs preserved.`);
