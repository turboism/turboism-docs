/** A visible locale control must not advertise interactivity before its handler exists. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin=process.env.SITE_ORIGIN||'http://127.0.0.1:3000';
const browser=await chromium.launch({headless:true});
try {
  const staticContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:844}});
  const staticPage=await staticContext.newPage();
  await staticPage.goto(origin+'/docs/en/use/overview',{waitUntil:'domcontentloaded'});
  const staticButton=staticPage.locator('.tb-header-row > .tb-language button[lang="ko"]');
  await staticButton.waitFor();
  assert.equal(await staticButton.isDisabled(),true,'SSR language buttons must remain disabled until their React handler is attached');
  await staticContext.close();
  const context=await browser.newContext({viewport:{width:1440,height:844}});
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  // Delay JavaScript, not the HTML. The browser sees the controls before hydration.
  let releaseScripts;const scriptsReady=new Promise(resolve=>{releaseScripts=resolve;});
  await context.route('**/*.js*',async route=>{await scriptsReady;await route.continue();});
  await page.goto(origin+'/docs/en/use/overview',{waitUntil:'commit'});
  const button=page.locator('.tb-header-row > .tb-language button[lang="ko"]');
  await button.waitFor();
  assert.equal(await button.isDisabled(),true,'Slow script loading must not expose an inert enabled language button');
  releaseScripts();
  // Playwright waits for the actual disabled state to clear; no arbitrary sleep.
  await button.click();
  await page.waitForURL(url=>url.pathname==='/docs/ko/use/overview');
  await page.waitForFunction(()=>document.documentElement.lang==='ko');
  assert.deepEqual(errors,[]);
  await context.close();
  console.log('PASS: SSR and delayed JavaScript cannot expose inert locale buttons; the first enabled click changes language.');
} finally {await browser.close();}
