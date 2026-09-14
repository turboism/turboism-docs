/** Real browser controls on a production build, including legacy preference conflicts. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const local = process.env.SITE_ORIGIN || 'http://127.0.0.1:3000';
const origin = 'https://turboism.dev';
const paths = ['/docs/en', '/docs/en/use/overview', '/docs/sdk/index.html'];
const report = [];
await mkdir('artifacts/site-language', { recursive: true });
for (let i = 0; i < 60; i++) {
  try { if ((await fetch(local + paths[0], { signal: AbortSignal.timeout(25000) })).ok) break; } catch {}
  if (i === 59) throw new Error('Documentation server did not become ready');
  await new Promise(resolve => setTimeout(resolve, 1000));
}
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) for (const path of paths) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    if (!process.env.LANGUAGE_LIVE_ONLY) await context.route(origin + '/**', async route => {
      try { const response = await route.fetch({ url: local + route.request().url().slice(origin.length), maxRedirects: 0 }); await route.fulfill({ response }); }
      catch { await route.abort(); }
    });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await context.addCookies([
      { name: 'turboism-language', value: 'zh', url: origin + '/' },
      { name: 'turboism-language', value: 'en', domain: '.turboism.dev', path: '/', secure: true },
      { name: 'language-test-unrelated', value: 'keep', url: origin + '/' },
    ]);
    const sdk = path.includes('/sdk/'), article = path.includes('/use/');
    try {
      const response = await page.goto(origin + path, { waitUntil: 'domcontentloaded', timeout: 45000 });
      assert.equal(response.status(), 200);
      const header = page.locator('header.tb-header').first();
      await header.waitFor();
      for (const locale of ['ko', 'zh', 'en', 'ja', 'ko']) {
        const lang = locale === 'zh' ? 'zh-CN' : locale;
        const desktop = header.locator(`.tb-header-row > .tb-language button[lang="${lang}"]`);
        let button = desktop;
        if (!await desktop.isVisible()) {
          const menu = header.locator('.tb-menu');
          if (!await menu.evaluate(node => node.open)) await menu.locator('summary').click();
          button = header.locator(`.tb-menu-panel button[lang="${lang}"]`);
        }
        await button.click();
        await page.waitForFunction(({ sdk, lang }) => sdk ? document.querySelector('[data-turboism-nav]')?.lang === lang : document.documentElement.lang === lang, { sdk, lang });
        if (!sdk) await page.waitForURL(url => url.pathname.startsWith(`/docs/${locale}`));
        assert.ok(await header.locator(`button[lang="${lang}"][aria-pressed=true]`).count() > 0);
        const preferences = (await context.cookies()).filter(cookie => cookie.name === 'turboism-language');
        assert.equal(preferences.length, 1, JSON.stringify(preferences));
        assert.equal(preferences[0].domain, '.turboism.dev');
        assert.equal(preferences[0].value, locale);
        assert.equal(preferences[0].path, '/');
        assert.equal((await context.cookies()).find(cookie => cookie.name === 'language-test-unrelated')?.value, 'keep');
        if (locale === 'ko' && !sdk) {
          // DocsPage renders an article, not the homepage's main element. Await
          // its streamed content instead of sampling the layout's earlier lang effect.
          const content = article ? page.locator('[data-language-fallback=en]') : page.locator('main');
          await content.waitFor();
          await page.waitForFunction(article => /[가-힣]/.test(document.querySelector(article ? '[data-language-fallback=en]' : 'main')?.textContent || ''), article);
          if (article) assert.match(await content.textContent(), /영어/);
        }
        const menu = header.locator('.tb-menu');
        if (await menu.evaluate(node => node.open)) await menu.locator('summary').click();
      }
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForFunction(sdk => sdk ? document.querySelector('[data-turboism-nav]')?.lang === 'ko' : document.documentElement.lang === 'ko', sdk);
      if (article) { await page.locator('[data-language-fallback=en]').waitFor(); assert.match(await page.locator('[data-language-fallback=en]').textContent(), /영어/); }
      assert.deepEqual(errors, []);
      report.push({ path, width, url: page.url(), switches: 5, legacyCookieMigrated: true, reload: true });
      await page.screenshot({ path: `artifacts/site-language/docs-${width}-${paths.indexOf(path)}.png`, fullPage: true });
    } catch (error) {
      report.push({ path, width, url: page.url(), error: error.message, errors });
      console.error('LANGUAGE_FAILURE', JSON.stringify(report.at(-1)));
      throw error;
    } finally { await context.close(); }
  }
} finally { await browser.close(); await writeFile('artifacts/site-language/report.json', JSON.stringify(report, null, 2)); }
console.log(`PASS docs: ${report.length} desktop/mobile route workflows, real language clicks, legacy cookies, reload and explicitly labelled English fallback.`);
