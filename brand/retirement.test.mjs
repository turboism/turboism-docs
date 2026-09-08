import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
const read=n=>readFileSync(new URL(n,import.meta.url),'utf8');
test('retired chat is absent and sponsor stays on www',()=>{const nav=JSON.parse(read('navigation.json'));assert.ok(!nav.links.some(([k,u])=>k==='chat'||u.includes('chat.turboism.dev')));assert.deepEqual(nav.links.find(([k])=>k==='sponsor'),['sponsor','https://turboism.dev/sponsor']);for(const l of['en','zh','ja'])assert.ok(nav.labels[l].sponsor);assert.doesNotMatch(read('shell.tsx'),/\| 'chat'/);});
