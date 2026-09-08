"""Remove only the retired Turboism chat entry; keep all other links and styling.
Run prepare, observe the regression failure, then apply and run the normal checks.
"""
from pathlib import Path
import json
import re
import subprocess
import sys

brand = Path('src/brand') if Path('src/brand/navigation.json').exists() else Path('brand')
nav_path = brand / 'navigation.json'
assert nav_path.is_file(), 'Expected the reviewed shared navigation configuration'
regression = brand / 'retired-chat.test.mjs'
if sys.argv[1] == 'prepare':
    regression.write_text('''import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
test('retired chat cannot return to desktop, mobile or SDK navigation',()=>{
 const nav=JSON.parse(read('navigation.json'));
 assert.deepEqual(nav.links.map(([key])=>key),['home','docs','sdk','plugins','learn','thanks','download']);
 for(const locale of ['en','zh','ja'])assert.equal('chat' in nav.labels[locale],false);
 assert.doesNotMatch(read('navigation.json'),/chat\\.turboism\\.dev/);
 assert.doesNotMatch(read('shell.tsx'),/['\"]chat['\"]/);
 for(const name of ['src/data/site.ts','components/network-navigation.tsx','placeholder/index.html','content/docs/use/overview.mdx','content/docs/use/overview.zh.mdx','content/docs/use/overview.ja.mdx']){
  if(existsSync(name))assert.doesNotMatch(readFileSync(name,'utf8'),/chat\\.turboism\\.dev/,name);
 }
});
''')
    print(regression)
    sys.exit(0)
assert sys.argv[1] == 'apply'
nav = json.loads(nav_path.read_text())
assert [key for key, _ in nav['links']] == ['home','docs','sdk','plugins','learn','chat','thanks','download'], 'Unexpected navigation drift; inspect before changing'
nav['links'] = [entry for entry in nav['links'] if entry[0] != 'chat']
for labels in nav['labels'].values():
    labels.pop('chat', None)
nav_path.write_text(json.dumps(nav, ensure_ascii=False, separators=(',', ':')) + '\n')
shell = brand / 'shell.tsx'
shell_text = shell.read_text()
assert " | 'chat'" in shell_text
shell.write_text(shell_text.replace(" | 'chat'", ''))
contract = brand / 'brand.test.mjs'
contract_text = contract.read_text()
assert "'learn','chat','thanks'" in contract_text
contract.write_text(contract_text.replace("'learn','chat','thanks'", "'learn','thanks'"))
changed = [str(nav_path), str(shell), str(contract), str(regression)]
# Known ancillary entry points from the source audit; no backend or stored data changes.
for name in ['src/data/site.ts','components/network-navigation.tsx','placeholder/index.html','README.md','content/docs/use/overview.mdx','content/docs/use/overview.zh.mdx','content/docs/use/overview.ja.mdx']:
    path=Path(name)
    if not path.exists():
        continue
    lines=path.read_text().splitlines(keepends=True)
    if not any('chat.turboism.dev' in line for line in lines):
        continue
    kept=[]
    for line in lines:
        if 'chat.turboism.dev' not in line:
            kept.append(line)
            continue
        clean=line.strip()
        safe=(clean.startswith('- ') or re.fullmatch(r'chat:\s*[\"\']https://chat\.turboism\.dev/?[\"\'],?',clean) or (clean.startswith('{ label:') and clean.endswith('},')) or (clean.startswith('<a ') and clean.endswith('</a>')))
        assert safe, f'Unexpected chat reference in {name}; manual review required'
    path.write_text(''.join(kept))
    changed.append(name)
# Retain an explicit no-chat DOM assertion alongside the existing real-browser checks.
qa=brand/'verify-browser.mjs'
if qa.exists():
    text=qa.read_text()
    anchor="assert.equal(await header.count(),1);"
    assert anchor in text
    text=text.replace(anchor,anchor+"assert.equal(await page.locator('a[href*=\"chat.turboism.dev\"]').count(),0,'Retired chat link remains in the page');")
    qa.write_text(text)
    changed.append(str(qa))
subprocess.run(['git','add','--',*changed],check=True)
print('Scoped navigation retirement changes: '+', '.join(changed))
