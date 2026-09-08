import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('all guide locales remove the retired chat help destination',()=>{
  for(const suffix of ['','.zh','.ja'])assert.doesNotMatch(readFileSync(`content/docs/use/overview${suffix}.mdx`,'utf8'),/chat\.turboism\.dev/);
  const nav=JSON.parse(readFileSync('brand/navigation.json','utf8'));
  assert.ok(nav.links.some(([key])=>key==='sponsor'));
  assert.ok(nav.links.every(([key])=>key!=='chat'));
});
