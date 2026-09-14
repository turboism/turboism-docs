/** One-shot, reviewable source migration. Only run on the named repair branch. */
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import assert from 'node:assert/strict';
const ts=createRequire(path.resolve('package.json'))('typescript');
const site=process.argv[2];
assert.ok(['www','docs','learn','plugin-directory','thanks'].includes(site));
const brand=site==='www'?'src/brand':'brand';
function save(file,text){mkdirSync(path.dirname(file),{recursive:true});writeFileSync(file,text);}
function edit(file,change){const old=readFileSync(file,'utf8');const next=change(old);assert.notEqual(next,old,`No change in ${file}`);save(file,next);}
function once(text,from,to){assert.equal(text.split(from).length,2,`Expected one anchor: ${from.slice(0,100)}`);return text.replace(from,to);}
function ast(text){return ts.createSourceFile('component.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);}
function body(text,name,replacement){const nodes=[];const walk=n=>{if(ts.isFunctionDeclaration(n)&&n.name?.text===name)nodes.push(n);ts.forEachChild(n,walk);};walk(ast(text));assert.equal(nodes.length,1,`function ${name}`);const b=nodes[0].body;return text.slice(0,b.getStart())+'{\n'+replacement+'\n}'+text.slice(b.end);}
function addObject(text,name,property){let found;const walk=n=>{if(ts.isVariableDeclaration(n)&&n.name.getText()===name){let value=n.initializer;while(value&&(ts.isAsExpression(value)||ts.isSatisfiesExpression(value)||ts.isParenthesizedExpression(value)))value=value.expression;if(value&&ts.isObjectLiteralExpression(value))found=value;}ts.forEachChild(n,walk);};walk(ast(text));assert.ok(found,`object ${name}`);if(found.properties.some(p=>p.name?.getText().replaceAll('"','').replaceAll("'",'')==='ko'))return text;const i=found.getStart()+1;return text.slice(0,i)+'\n  ko: '+property+',\n'+text.slice(i);}
function addImport(text,line){if(text.includes(line))return text;const marker=text.startsWith('"use client";')?'"use client";':text.startsWith("'use client';")?"'use client';":null;return marker?once(text,marker,marker+'\n'+line):line+'\n'+text;}
function four(text){return text.replace(/(["'])en\1\s*\|\s*(["'])zh\2\s*\|\s*(["'])ja\3(?!\s*\|\s*["']ko)/g,"'en' | 'zh' | 'ja' | 'ko'").replace(/\[(['"])en\1,\s*(['"])zh\2,\s*(['"])ja\3\]/g,"['en', 'zh', 'ja', 'ko']");}
const helper=readFileSync(new URL('./preference.mjs',import.meta.url),'utf8');
save(`${brand}/language-preference.mjs`,helper);
save(`${brand}/language-preference.d.mts`,"export type SiteLanguage = 'en' | 'zh' | 'ja' | 'ko';\nexport function persistLanguagePreference(language: SiteLanguage): void;\nexport function readLanguagePreference(): SiteLanguage | null;\n");
save('tests/language-preference.test.mjs',readFileSync(new URL('./preference.test.mjs',import.meta.url),'utf8'));
save('scripts/verify-site-language.mjs',readFileSync(new URL('./verify.mjs',import.meta.url),'utf8'));
const preferenceImport="import { persistLanguagePreference, readLanguagePreference } from '@/brand/language-preference.mjs';";
const nav={home:'홈',docs:'문서',sdk:'SDK',plugins:'플러그인',learn:'튜토리얼',thanks:'감사의 말',download:'다운로드',menu:'탐색 및 언어',nav:'Turboism 사이트',sponsor:'후원'};
const navFile=`${brand}/navigation.json`,navigation=JSON.parse(readFileSync(navFile,'utf8'));navigation.labels.ko=nav;save(navFile,JSON.stringify(navigation,null,2)+'\n');
const shell=`${brand}/shell.tsx`;let shellText=readFileSync(shell,'utf8');shellText=four(shellText);shellText=shellText.replace(/ja:\s*'日本語'(?!\s*,\s*ko:)/g,"ja: '日本語', ko: '한국어'");save(shell,shellText);
const qq=`${brand}/qq.mjs`;if(existsSync(qq))save(qq,addObject(readFileSync(qq,'utf8'),'QQ_TEXT',JSON.stringify({label:'Turboism QQ 그룹 참여',title:'함께 나누는 창작 이야기',subtitle:'Turboism QQ 커뮤니티',copy:'그룹 번호 복사',open:'QQ에서 열기',hint:'앱이 열리지 않으면 QQ에서 이 그룹 번호를 검색하여 가입을 신청하세요',copied:'그룹 번호를 복사했습니다',failed:'그룹 번호를 선택하여 직접 복사해 주세요',close:'닫기',waiting:'QQ 실행을 요청했습니다. 그룹 번호를 복사할 수도 있습니다'})));
const staticFile=`${brand}/static-header.mjs`;
if(existsSync(staticFile))edit(staticFile,t=>{
 t=addImport(t,"import { persistLanguagePreference, readLanguagePreference } from './language-preference.mjs';");
 t=four(t).replace(/ja:\s*'日本語'(?!\s*,\s*ko:)/g,"ja:'日本語',ko:'한국어'");
 t=once(t,'export const staticHeaderScript = `(() => {','export const staticHeaderScript = `(() => {\n const persistLanguagePreference=${persistLanguagePreference.toString()};\n const readLanguagePreference=${readLanguagePreference.toString()};');
 t=t.replace(/if\(persist\)\{const domain=[^\n]+\}/,"if(persist)persistLanguagePreference(locale);");
 t=t.replace(/const saved=document\.cookie[^\n]+/,"const saved=readLanguagePreference();change(saved||'en',false);");
 return t;
});
if(site==='www') {
 edit('src/lib/i18n.ts',t=>body(body(addImport(t,preferenceImport),'persistLanguage','  persistLanguagePreference(language);'),'readStoredLanguage','  return readLanguagePreference();'));
 // Korean documentation now has a real locale route with explicitly labelled fallback content.
 edit('src/components/download-page.tsx',t=>once(once(t,"  // The independently deployed documentation does not yet have a Korean locale.\n",''),"${lang==='ko'?'en':lang}",'${lang}'));
 // Update the related browser expectation, not the download integrity checks.
 const off='scripts/verify-downloads-offline.mjs';edit(off,t=>t.replaceAll('/docs/en/use/overview','/docs/ko/use/overview'));
}
const providerFile='components/language-provider.tsx';
const providerKo={
 learn:{home:'홈',docs:'문서',sdk:'SDK',plugins:'플러그인',learn:'튜토리얼',chat:'채팅',download:'다운로드',github:'GitHub',contact:'문의',product:'제품',brandSuffix:'튜토리얼',language:'한국어'},
 'plugin-directory':{home:'홈',product:'제품',docs:'문서',sdk:'SDK',plugins:'플러그인',learn:'튜토리얼',chat:'채팅',download:'다운로드',github:'GitHub',contact:'문의',report:'문제 신고',nominate:'서드파티 플러그인 추천',request:'플러그인 요청',search:'플러그인 검색',all:'모든 플러그인',language:'한국어',filter:'필터',clearSearch:'검색 지우기',directoryLabel:'플러그인 디렉터리',tagsLabel:'플러그인 태그',noMatchTitle:'일치하는 플러그인이 없습니다.',noMatchGuidance:'다른 검색어를 입력하거나 필터를 해제해 보세요.',emptyTitle:'아직 등록된 플러그인이 없습니다.',emptyExplanation:'디렉터리는 공개되어 있으며 등록 조건을 충족하는 첫 릴리스를 기다리고 있습니다. 계획 중이거나 사용할 수 없는 플러그인을 임시로 등록하지 않습니다.',nominateQualifying:'등록 조건을 충족하는 서드파티 플러그인 추천',official:'공식',reviewed:'검토된 서드파티',toggleNavigation:'탐색 메뉴 열기 및 닫기',selectLanguage:'언어 선택'},
 docs:{language:'한국어',nav:{home:'홈',docs:'문서',download:'다운로드',plugins:'플러그인',learn:'튜토리얼',chat:'채팅',github:'GitHub',contact:'문의'},home:{eyebrow:'Turboism / 문서',title:'더 명확한 경계 위에서 개발하세요.',description:'Turboism의 기본 사용법과 개발 문서입니다.',useTurboismTitle:'기본 사용법',useTurboismDescription:'Turboism 설치와 사용, 플러그인 관리, 업데이트, 복구 및 제거 방법을 알아보세요.',buildPluginTitle:'개발',buildPluginDescription:'Turboism에 기여하거나 Java 플러그인, GraalJS 및 MCP로 개발하세요.',learnMore:'자세히 보기'}}
};
if(site==='docs'){
 edit('lib/i18n.ts',t=>{
  t=four(addImport(t,"import { persistLanguagePreference } from '@/brand/language-preference.mjs';"));
  t=once(t,'fallbackLanguage: null,','fallbackLanguage: "en",');
  return body(t,'persistLanguage','  persistLanguagePreference(language);');
 });
 edit(providerFile,t=>addObject(t,'copy',JSON.stringify(providerKo.docs)));
 edit('lib/layout.shared.tsx',t=>once(t,'en: { displayName: "English" },',`en: { displayName: "English" },\n    ko: ${JSON.stringify({displayName:'한국어','Search(search trigger)':'문서 검색','Search(search dialog)':'검색','No results found(search dialog)':'검색 결과가 없습니다','On this page(table of contents)':'이 페이지의 목차','Previous Page(pagination)':'이전 페이지','Next Page(pagination)':'다음 페이지','Choose a language(language switcher)':'언어 선택','Choose a language(language switcher)(aria-label)':'언어 선택'})},`));
 edit('components/language-switcher.tsx',t=>once(t,"router.push(segments.join('/') || `/${next}`);","router.push((segments.join('/') || `/${next}`) + window.location.search + window.location.hash);"));
 edit('app/[lang]/[...slug]/page.tsx',t=>{
  t=once(t,'      <DocsTitle className="text-blue-600">','      {lang === "ko" && !/\\.ko\\.mdx?$/.test(page.path) && <p role="note" data-language-fallback="en" lang="ko">이 문서의 한국어 번역은 아직 제공되지 않아 영어 원문을 표시합니다.</p>}\n      <DocsTitle className="text-blue-600">');
  t=once(t,'<DocsBody className="[&_a]:text-blue-600">','<DocsBody lang={lang === "ko" && !/\\.ko\\.mdx?$/.test(page.path) ? "en" : lang} className="[&_a]:text-blue-600">');
  return t;
 });
}
if(site==='learn'||site==='plugin-directory'){
 edit(providerFile,t=>{
  t=four(addImport(t,preferenceImport));t=addObject(t,'copy',JSON.stringify(providerKo[site]));
  t=once(t,'value === "en" || value === "zh" || value === "ja";','value === "en" || value === "zh" || value === "ja" || value === "ko";');
  t=body(t,'readLanguageCookie','  return readLanguagePreference();');
  t=body(t,'persistLanguage','  persistLanguagePreference(language);');
  t=t.replace(/const LANGUAGE_COOKIE = [^\n]+\n/,'').replace(/const LANGUAGE_COOKIE_MAX_AGE = [^\n]+\n/,'');
  t=once(t,'return () => window.clearTimeout(timer);',`const update = () => { const selected = readLanguagePreference(); if (selected) setLanguage(selected); };\n    window.addEventListener('turboism:language', update);\n    window.addEventListener('storage', update);\n    window.addEventListener('pageshow', update);\n    return () => { window.clearTimeout(timer); window.removeEventListener('turboism:language', update); window.removeEventListener('storage', update); window.removeEventListener('pageshow', update); };`);
  if(site==='learn')t=body(t,'changeLanguage',`    const url = new URL(window.location.href);\n    if (url.searchParams.has('lang')) { url.searchParams.set('lang', nextLanguage); window.history.replaceState(null, '', url.href); }\n    persistLanguage(nextLanguage);\n    setLanguage(nextLanguage);`);
  return t;
 });
 const switcher='components/language-switcher.tsx';if(existsSync(switcher)){
  let t=readFileSync(switcher,'utf8');t=four(t);t=t.replace(/ja:\s*"日本語"(?!\s*,\s*ko:)/g,'ja: "日本語", ko: "한국어"');save(switcher,t);
 }
}
if(site==='thanks')edit('app/page.tsx',t=>{
 t=addImport(t,preferenceImport);t=addObject(t,'text',JSON.stringify({eyebrow:'당신에게 드리는 꽃다발',title:'감사합니다.',contributors:'기여자',profile:'프로필 열기'}));
 t=once(t,"const stored=document.cookie.split('; ').find(value=>value.startsWith('turboism-language='))?.split('=')[1];if(stored==='en'||stored==='zh'||stored==='ja')","const stored=readLanguagePreference();if(stored)");
 return body(t,'changeLanguage','setLanguage(next); persistLanguagePreference(next);');
});
if(site==='learn'){
 const file='components/learn-prototype.tsx';
 edit(file,t=>{
  t=four(addImport(t,preferenceImport));
  const dictionaries={
   sortLabels:{featured:'추천',newest:'최신순',views:'조회순',likes:'좋아요순',trending:'인기순'},
   localizedPlatformLabels:{cubism:'Live2D Cubism',vts:'VTube Studio'},
   localizedTypeLabels:{video:'동영상',doc:'문서',gif:'GIF',example:'예제'},
   localizedLanguageLabels:{en:'영어',zh:'중국어',ja:'일본어',ko:'한국어',other:'기타'},
   localizedLevelLabels:{beginner:'입문',intermediate:'중급',advanced:'고급'},
   localizedSourceKindLabels:{official:'공식',community:'커뮤니티'},
   localizedTagLabels:{modeling:'모델링',rigging:'리깅',parameters:'파라미터',deformers:'디포머',physics:'물리',expressions:'표정',tracking:'트래킹',hotkeys:'단축키',export:'내보내기',troubleshooting:'문제 해결',workflow:'작업 흐름',beginner:'입문',advanced:'고급',setup:'설정',calibration:'보정','face-tracking':'얼굴 트래킹',shortcuts:'바로가기'}
  };
  for(const[name,dict]of Object.entries(dictionaries))t=addObject(t,name,JSON.stringify(dict));
  t=addObject(t,'uiText',`{
   siteBadge:'튜토리얼',heroTitle:'Cubism / VTS 튜토리얼 라이브러리',variantCTitle:'튜토리얼 목록',searchPlaceholder:'물리, 단축키, 내보내기, VTS 검색...',searchLabel:'튜토리얼 검색',sortLabel:'튜토리얼 정렬',layoutLabel:'레이아웃',languageLabel:'언어',switchLanguage:'언어 변경',languageMenu:'언어 메뉴',selectLanguage:(name:string)=>name+'로 언어 변경',currentLayoutAria:(current:string,next:string)=>'현재 레이아웃: '+current+'. '+next+'로 변경.',switchLayoutTitle:(next:string)=>next+'로 변경',nextLayout:(code:Variant)=>'다음 '+code,platform:'플랫폼',type:'유형',tags:'태그',more:'더 보기',level:'난이도',source:'출처',filters:'필터',tagsUseAnd:'태그',reset:'초기화',resetSearchAndFilters:'검색 및 필터 초기화',resultCount:(count:number)=>count+'개의 일치하는 자료',noResultsTitle:'조건에 맞는 튜토리얼이 없습니다',noResultsBody:'태그를 제거하거나 플랫폼과 유형 필터를 변경해 보세요.',clearFilters:'필터 지우기',openResource:'자료 열기',open:'열기',like:(title:string)=>title+' 좋아요',resources:'자료',views:'조회수',likes:'좋아요',minRead:(minutes:number)=>'읽는 데 '+minutes+'분',minutes:(minutes:number)=>minutes+'분',quickDemo:'간단한 시연',reference:'참고 자료'
  }`);
  t=body(t,'parseLocale',"  return value === 'en' || value === 'zh' || value === 'ja' || value === 'ko' ? value : null;");
  t=body(t,'getHtmlLang',"  return locale === 'zh' ? 'zh-CN' : locale;");
  t=body(t,'detectBrowserLocale',"  const language = typeof navigator === 'undefined' ? '' : navigator.language.split('-')[0].toLowerCase();\n  return parseLocale(language) ?? 'en';");
  t=body(t,'readSharedLocale','  return readLanguagePreference();');
  t=body(t,'persistSharedLocale','  persistLanguagePreference(locale);');
  t=t.replace(/const sharedLanguageCookie = [^\n]+\n/,'').replace(/const sharedLanguageCookieMaxAge = [^\n]+\n/,'');
  t=once(t,'window.addEventListener(localeStorageKey, onStoreChange);',"window.addEventListener(localeStorageKey, onStoreChange);\n  window.addEventListener('turboism:language', onStoreChange);");
  t=once(t,'window.removeEventListener(localeStorageKey, onStoreChange);',"window.removeEventListener(localeStorageKey, onStoreChange);\n    window.removeEventListener('turboism:language', onStoreChange);");
  t=body(t,'changeLocale',`    const url = new URL(window.location.href);\n    if (url.searchParams.has('lang')) { url.searchParams.set('lang', next); window.history.replaceState(null, '', url.href); }\n    writePreferredLocale(next);`);
  return t;
 });
 edit('components/site-shell.tsx',t=>addObject(t,'names',JSON.stringify({A:'라이브러리',B:'학습 경로',C:'간략 목록'})));
}
console.log(`Applied bounded language repair to ${site}. Catalogs, credentials, API contracts and mobile homepage CSS are unchanged.`);
