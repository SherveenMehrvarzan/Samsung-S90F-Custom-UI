require('node:fs').mkdirSync('work',{recursive:true});
const {chromium} = require('playwright');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const page = await browser.newPage({viewport:{width:1920,height:1080}});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file:///'+path.resolve('app/index.html').replaceAll('\\','/'));
  assert.equal(await page.locator(':focus').getAttribute('data-key'),'netflix');
  for (let i=0;i<4;i++) await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator(':focus').getAttribute('data-key'),'twitch');
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator(':focus').getAttribute('data-key'),'home');
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator(':focus').getAttribute('data-key'),'settings');
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#toast').textContent(),/Preview only/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator(':focus').getAttribute('data-key'),'netflix');
  await page.locator('#toast').evaluate(el=>el.hidden=true);
  await page.screenshot({path:'work/preview.png'});
  // Exercise actual Tizen code paths with a fake device API. No TV writes.
  await page.addInitScript(()=>{
    window.launched=[];
    window.tizen={application:{
      getAppsInfo:ok=>ok([
        {id:'n',name:'Netflix'},{id:'m',name:'HBO Max'},
        {id:'org.tizen.primevideo-dummy',name:'Prime Video'},
        {id:'org.tizen.primevideo',name:'Prime Video'},{id:'h',name:'Hulu'},
        {id:'t',name:'Twitch'},{id:'org.tizen.menu',name:'org.tizen.menu'},
        {id:'com.samsung.tv.csfs',name:'System Hub'}
      ]),
      launch:(id,ok)=>{window.launched.push(id);ok();},
      getCurrentApplication:()=>({appInfo:{id:'QuietHome1.Launcher'},exit:()=>window.exited=true})
    }};
  });
  await page.reload();
  for (const key of ['netflix','hbo','prime','hulu','twitch','settings','home']) await page.locator('[data-key="'+key+'"]').click();
  assert.deepEqual(await page.evaluate(()=>window.launched),['n','m','org.tizen.primevideo','h','t','org.tizen.menu','com.samsung.tv.csfs']);
  await page.keyboard.press('Escape'); assert.equal(await page.evaluate(()=>window.exited),true);
  await page.evaluate(()=>{tizen.application.getAppsInfo=ok=>ok([]);document.dispatchEvent(new Event('visibilitychange'));});
  await page.locator('[data-key="netflix"]').click();
  assert.match(await page.locator('#toast').textContent(),/not found/);
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: remote navigation, preview behavior, seven mocked TV shortcuts, Back exit, missing-app handling; no page errors.');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
