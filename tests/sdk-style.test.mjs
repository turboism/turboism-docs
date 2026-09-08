import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const site = path.resolve(import.meta.dirname, '..');
const script = path.join(site, 'scripts/style-sdk-api.mjs');
test('SDK styling is repeatable and preserves nested API links, anchors and text', () => {
 assert.ok(existsSync(script), 'SDK styling entry point is missing');
 const fixture = mkdtempSync(path.join(tmpdir(), 'turboism-sdk-'));
 try {
  mkdirSync(path.join(fixture, 'nested'), {recursive:true});
  const body='<a id="member" href="../index.html#type">Actual API description &amp; signature()</a>';
  const file=path.join(fixture,'nested/Type.html');
  writeFileSync(file,`<html><head><title>Type</title></head><body><div class="flex-box">${body}</div></body></html>`);
  const run=()=>spawnSync(process.execPath,[script, fixture], {cwd:site,encoding:'utf8'});
  assert.equal(run().status,0); const first=readFileSync(file,'utf8');
  assert.ok(first.includes(body)); assert.ok(first.includes('../turboism-brand.css'));
  assert.equal(run().status,0); assert.equal(readFileSync(file,'utf8'),first);
  assert.equal((first.match(/data-turboism-nav/g)||[]).length,1);
 } finally {rmSync(fixture,{recursive:true,force:true});}
});
