import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const directory = path.dirname(fileURLToPath(import.meta.url));
const css = readFileSync(path.join(directory, 'brand.css'), 'utf8');
const shell = readFileSync(path.join(directory, 'shell.tsx'), 'utf8');
test('approved brand tokens leave semantic state palettes alone', () => {
 for (const token of ['#6A5ACD','#EEE8AA','#FCFBF7','#30294B','#756D89','#E5E1EE']) assert.ok(css.includes(token),token);
 assert.doesNotMatch(css,/--color-(?:red|green|amber)-\d+\s*:/);
 assert.ok(css.includes('prefers-reduced-motion'));
 assert.ok(css.includes('--color-fd-primary'));
 assert.doesNotMatch(css, /(?:^|\n)\s*(?:svg|h1)\s*\{/);
});
test('canonical navigation, community icons and locale slots remain available', () => {
 for (const target of ['https://turboism.dev/','https://turboism.dev/docs','https://turboism.dev/sdk/index.html','https://turboism.dev/plugins','https://turboism.dev/learn','https://chat.turboism.dev','https://thanks.turboism.dev/thanks','https://turboism.dev/download','https://discord.gg/bect4anknH','https://github.com/turboism/Turboism']) assert.ok(shell.includes(target),target);
 for (const marker of ['<details','<summary','aria-current','aria-label="Turboism Discord"','aria-label="Turboism GitHub"','BrandLanguage','languageControl','tools']) assert.ok(shell.includes(marker),marker);
 assert.doesNotMatch(shell,/为创作者而做|非 Live2D 官方出品|首页设计预览|给想法一点活动空间/);
});
test('application root actually imports the shared stylesheet', () => {
 const layout=path.join(directory,'../app/layout.tsx');
 assert.ok(existsSync(layout),'root layout missing');
 assert.ok(readFileSync(layout,'utf8').includes("@/brand/brand.css"));
});
