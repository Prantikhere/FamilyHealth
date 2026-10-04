import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/usr/bin/google-chrome';
const URL = process.argv[2] || 'https://prantikhere.github.io/FamilyHealth/';

const VIEWPORTS = [
  { name: 'Mobile Small (Galaxy S8)', width: 360, height: 740 },
  { name: 'Mobile Standard (iPhone 12/13/14)', width: 390, height: 844 },
  { name: 'Mobile Large (Pixel 7)', width: 412, height: 915 },
  { name: 'Tablet (iPad Mini)', width: 768, height: 1024 },
  { name: 'Desktop HD', width: 1280, height: 800 },
  { name: 'Desktop Full HD', width: 1920, height: 1080 },
];

async function checkResponsiveness() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n--------------------------------------------`);
    console.log(`Checking Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`--------------------------------------------`);

    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

    // Check Landing Page overflow
    const landingOverflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });
    console.log(`Landing Page: clientWidth=${landingOverflow.clientWidth}, scrollWidth=${landingOverflow.scrollWidth}, overflow=${landingOverflow.hasHorizontalScroll}`);

    // Enter Demo App
    const enterBtn = await page.$('button');
    // find Enter Live Demo
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.innerText || '', b);
      if (text.includes('Enter Live Demo') || text.includes('Launch Live POV')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));

    // Check App View overflow
    const appOverflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const appShell = document.querySelector('.app-shell');
      return {
        docScrollWidth: doc.scrollWidth,
        docClientWidth: doc.clientWidth,
        hasHorizontalScroll: doc.scrollWidth > doc.clientWidth,
        appShellWidth: appShell ? appShell.getBoundingClientRect().width : null,
        overflowingElements: Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.right > window.innerWidth + 1;
          })
          .map(el => ({
            tag: el.tagName,
            class: el.className,
            right: el.getBoundingClientRect().right,
            width: el.getBoundingClientRect().width
          }))
          .slice(0, 5)
      };
    });

    console.log(`App Shell: docWidth=${appOverflow.docClientWidth}, scrollWidth=${appOverflow.docScrollWidth}, hasScroll=${appOverflow.hasHorizontalScroll}`);
    console.log(`App Shell Width: ${appOverflow.appShellWidth}`);
    if (appOverflow.overflowingElements.length > 0) {
      console.log(`Overflowing elements:`, JSON.stringify(appOverflow.overflowingElements, null, 2));
    }

    await page.close();
  }

  await browser.close();
}

checkResponsiveness().catch(console.error);
