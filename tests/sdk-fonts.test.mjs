import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
test('SDK extraction uses actual webfont variables rather than earlier Tailwind defaults', async()=>{
 const root=await mkdtemp(join(tmpdir(),'sdk-fonts-'));
 try{
  const assets=join(root,'assets'),out=join(root,'out.css');await mkdir(assets);
  await writeFile(join(assets,'all.css'),'@layer theme{:root{--font-sans:system-ui;--font-mono:monospace}}@font-face{font-family:Geist;src:url(../media/geist.woff2)}.geist__variable{--font-sans:Geist,"Geist Fallback"}.mono__variable{--font-mono:"Geist Mono"}.tinos__variable{--font-violet-latin:Tinos}.sc__variable{--font-violet-zh:"Noto Serif SC"}.jp__variable{--font-violet-ja:"Noto Serif JP"}');
  execFileSync(process.execPath,['scripts/style-sdk-fonts.mjs',assets,out]);
  const result=await readFile(out,'utf8');assert.match(result,/--font-sans:Geist/);assert.match(result,/--font-mono:"Geist Mono"/);assert.match(result,/\/docs\/_next\/static\/media\/geist.woff2/);
 }finally{await rm(root,{recursive:true,force:true});}
});
