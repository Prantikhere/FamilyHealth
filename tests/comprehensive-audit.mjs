import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/usr/bin/google-chrome';
const LOCAL_URL = 'http://localhost:3001/FamilyHealth/';
const LIVE_URL = 'https://prantikhere.github.io/FamilyHealth/';

const VIEWPORTS = [
  { name: 'Mobile (iPhone SE)', width: 375, height: 667, isMobile: true, hasTouch: true },
  { name: 'Mobile (Pixel 7)', width: 412, height: 915, isMobile: true, hasTouch: true },
  { name: 'Tablet (iPad Mini)', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'Laptop (1366x768)', width: 1366, height: 768, isMobile: false, hasTouch: false },
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080, isMobile: false, hasTouch: false },
];

async function findButtonByText(page, searchTexts) {
  const texts = Array.isArray(searchTexts) ? searchTexts : [searchTexts];
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.innerText || el.textContent || '', btn);
    const aria = await page.evaluate(el => el.getAttribute('aria-label') || '', btn);
    const title = await page.evaluate(el => el.getAttribute('title') || '', btn);
    for (const t of texts) {
      if (
        text.toLowerCase().includes(t.toLowerCase()) || 
        aria.toLowerCase().includes(t.toLowerCase()) ||
        title.toLowerCase().includes(t.toLowerCase())
      ) {
        return btn;
      }
    }
  }
  return null;
}

async function runTestSuite(targetUrl, targetName) {
  console.log(`\n==================================================`);
  console.log(`🚀 STARTING AUDIT FOR: ${targetName}`);
  console.log(`   URL: ${targetUrl}`);
  console.log(`==================================================\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
  });

  let testPassed = 0;
  let testFailed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName} ${details ? '(' + details + ')' : ''}`);
      testPassed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
      testFailed++;
    }
  }

  try {
    // 1. Initial Page Load
    console.log(`\n[Phase 1: Initial Page Load & Assets]`);
    const response = await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    assert(response && response.status() === 200, 'Page loaded with HTTP 200', `Status: ${response?.status()}`);
    
    const pageTitle = await page.title();
    assert(pageTitle.includes('SeiHealth'), 'Page title reflects SeiHealth branding', `Title: "${pageTitle}"`);

    // 2. Landing Page Elements
    console.log(`\n[Phase 2: Landing Page Flow & Presentation]`);
    const heroHeading = await page.$eval('h1', (el) => el.innerText).catch(() => null);
    assert(!!heroHeading && heroHeading.length > 5, 'Landing page Hero heading rendered', heroHeading?.slice(0, 40) + '...');

    const enterDemoBtn = await findButtonByText(page, ['Enter', 'Launch', 'Explore', 'Portal', 'Demo']);
    assert(!!enterDemoBtn, 'Interactive CTA button exists on landing page');

    // Click CTA to navigate to Login
    if (enterDemoBtn) {
      await enterDemoBtn.click();
      await new Promise(r => setTimeout(r, 600));
    }

    // 3. Login Section & Demo Credentials
    console.log(`\n[Phase 3: Login View & Authentication Flow]`);
    const loginHeading = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.innerText : '';
    });
    assert(
      loginHeading.includes('SeiHealth') || loginHeading.includes('Sovereign') || loginHeading.includes('Portal'),
      'Navigated to Login Portal',
      loginHeading
    );

    // Verify Evaluator Quick Access button exists
    const oneTapBtn = await findButtonByText(page, ['1-Tap', 'Evaluator', 'Bypass']);
    assert(!!oneTapBtn, '1-Tap Evaluator quick-access bypass button present');

    // Click 1-Tap Evaluator Access
    if (oneTapBtn) {
      await oneTapBtn.click();
      await new Promise(r => setTimeout(r, 1200));
    }

    // 4. 360° Household Dashboard
    console.log(`\n[Phase 4: 360° Household Dashboard Verification]`);
    const dashboardText = await page.evaluate(() => document.body.innerText);
    assert(dashboardText.includes('Bello Household') || dashboardText.includes('Household') || dashboardText.includes('360°'), 'Household Dashboard loaded');
    assert(dashboardText.includes('Emergency') || dashboardText.includes('ICE') || dashboardText.includes('Quick-Dial'), 'Emergency quick-access widget rendered');
    assert(dashboardText.includes('Genotype') || dashboardText.includes('Sickle') || dashboardText.includes('Compatibility'), 'Genotype compatibility widget rendered');
    assert(dashboardText.includes('Vaccination') || dashboardText.includes('Immunization'), 'Vaccination tracking rendered');

    // 5. User Profile Icon Click (Verifying Crash Fix)
    console.log(`\n[Phase 5: User Profile & Top Bar Interaction (Fix Verification)]`);
    const initialErrorsLen = pageErrors.length + consoleErrors.length;
    
    const userMenuButton = await page.$('button[aria-label="User Account Menu"]');
    assert(!!userMenuButton, 'User Account Menu button found in header');
    
    if (userMenuButton) {
      await userMenuButton.click();
      await new Promise(r => setTimeout(r, 500));
      
      const menuVisible = await page.evaluate(() => {
        return document.body.innerText.includes('Switch Account') ||
               document.body.innerText.includes('Sign Out') ||
               document.body.innerText.includes('Session Active');
      });
      assert(menuVisible, 'User profile popup menu rendered cleanly');
      
      const errorsAfterClick = pageErrors.length + consoleErrors.length;
      assert(errorsAfterClick === initialErrorsLen, 'Zero crashes or console errors when opening user menu', `Errors: ${errorsAfterClick - initialErrorsLen}`);

      // Dismiss menu by clicking backdrop
      const backdrop = await page.$('div.fixed.inset-0');
      if (backdrop) {
        await backdrop.click();
        await new Promise(r => setTimeout(r, 300));
      } else {
        await userMenuButton.click();
        await new Promise(r => setTimeout(r, 300));
      }
    }

    // 6. Language Switcher
    console.log(`\n[Phase 6: Multi-lingual Voice & Language Switcher]`);
    const langBtn = await findButtonByText(page, ['EN', 'English', 'HA', 'Hausa', 'YO', 'Yoruba']);
    if (langBtn) {
      await langBtn.click();
      await new Promise(r => setTimeout(r, 400));
      const hasLangOptions = await page.evaluate(() => {
        return document.body.innerText.includes('Yorùbá') || document.body.innerText.includes('Hausa') || document.body.innerText.includes('Igbo');
      });
      assert(hasLangOptions, 'Language selection options (Yorùbá, Hausa, Igbo) displayed');
      // Dismiss
      const backdrop = await page.$('div.fixed.inset-0');
      if (backdrop) await backdrop.click();
      await new Promise(r => setTimeout(r, 200));
    }

    // 7. ICE Emergency QR Modal
    console.log(`\n[Phase 7: Offline ICE Emergency QR Code Generation]`);
    const iceBtn = (await page.$('button[title*="emergency ICE pass"]')) || 
                   (await findButtonByText(page, ['ICE PASS']));
    if (iceBtn) {
      await page.evaluate(el => {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        el.click();
      }, iceBtn);
      await new Promise(r => setTimeout(r, 1000));
      const iceModalOpen = await page.evaluate(() => {
        return document.body.innerText.includes('EMERGENCY') && 
               (document.body.innerText.includes('ICE') || document.body.innerText.includes('Blood Group'));
      });
      assert(iceModalOpen, 'Emergency Medical Pass / ICE Modal opened');

      const qrImg = await page.waitForSelector('img[alt="Offline ICE QR Matrix"]', { timeout: 3000 }).catch(() => null);
      const hasQrSrc = qrImg ? await page.evaluate(el => el.src && el.src.startsWith('data:image/'), qrImg) : false;
      assert(!!qrImg && hasQrSrc, 'QR Code image generated and rendered with embedded offline data');

      // Close modal
      const closeBtn = await page.$('button[aria-label="Close emergency card"]');
      if (closeBtn) {
        await page.evaluate(el => el.click(), closeBtn);
        await new Promise(r => setTimeout(r, 400));
      }
    } else {
      assert(false, 'ICE PASS button found on household member card');
    }

    // 8. Bottom Navigation Integration Testing
    console.log(`\n[Phase 8: Multi-Module Integration (Navigation Tabs)]`);
    
    // Tab 1: OCR Capture View
    const captureTab = await findButtonByText(page, ['Snap Record', 'Capture']);
    if (captureTab) {
      await captureTab.click();
      await new Promise(r => setTimeout(r, 400));
      const captureText = await page.evaluate(() => document.body.innerText);
      assert(
        captureText.includes('Document') || captureText.includes('Paper') || captureText.includes('Scan') || captureText.includes('OCR'),
        'Navigated to OCR Paper Digitization View'
      );
    }

    // Tab 2: MCH Maternal & Child Health
    const mchTab = await findButtonByText(page, ['Maternal/EPI', 'MCH']);
    if (mchTab) {
      await mchTab.click();
      await new Promise(r => setTimeout(r, 400));
      const mchText = await page.evaluate(() => document.body.innerText);
      assert(
        mchText.includes('Maternal') || mchText.includes('EPI') || mchText.includes('Immunization') || mchText.includes('Vaccine'),
        'Navigated to Maternal & Child Health (MCH/EPI) Portal'
      );
    }

    // Tab 3: Family Tree & Genetic Risk
    const treeTab = await findButtonByText(page, ['Family Tree', 'Tree']);
    if (treeTab) {
      await treeTab.click();
      await new Promise(r => setTimeout(r, 400));
      const treeText = await page.evaluate(() => document.body.innerText);
      assert(
        treeText.includes('Genotype') || treeText.includes('Sickle') || treeText.includes('Pedigree') || treeText.includes('Genetic'),
        'Navigated to Family Tree & Genetic Risk View'
      );
    }

    // Tab 4: Expense Ledger
    const expTab = await findButtonByText(page, ['Expenses', 'Expense']);
    if (expTab) {
      await expTab.click();
      await new Promise(r => setTimeout(r, 400));
      const expText = await page.evaluate(() => document.body.innerText);
      assert(
        expText.includes('Expense') || expText.includes('Spending') || expText.includes('Out-of-Pocket') || expText.includes('NHIA'),
        'Navigated to Out-of-Pocket Expense Ledger View'
      );
    }

    // Return to Overview / Dashboard
    const dashTab = await findButtonByText(page, ['Overview']);
    if (dashTab) {
      await dashTab.click();
      await new Promise(r => setTimeout(r, 400));
    }

    // 9. Full Responsive Viewport Audit
    console.log(`\n[Phase 9: Multi-Device Responsive Layout Audit]`);
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
      await new Promise(r => setTimeout(r, 300));

      const overflowResult = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const clientWidth = window.innerWidth;
        const hasOverflow = scrollWidth > clientWidth + 2; // small 2px tolerance for subpixels
        return { scrollWidth, clientWidth, hasOverflow };
      });

      assert(
        !overflowResult.hasOverflow,
        `Viewport ${vp.name} (${vp.width}x${vp.height}) has NO horizontal scroll overflow`,
        `ScrollWidth: ${overflowResult.scrollWidth}px, WindowWidth: ${overflowResult.clientWidth}px`
      );

      // Check Mobile bottom navigation if mobile
      if (vp.isMobile && vp.width < 768) {
        const bottomNav = await page.$('nav[role="navigation"], nav.fixed.bottom-0');
        assert(!!bottomNav, `Mobile bottom tab navigation bar active for ${vp.name}`);
      }
    }

    // 10. Console / Page Error Summary
    console.log(`\n[Phase 10: Runtime Integrity & Console Diagnostics]`);
    assert(pageErrors.length === 0, 'Zero Uncaught Exceptions during full lifecycle', pageErrors.join(' | '));
    const nonFaviconErrors = consoleErrors.filter(e => !e.includes('favicon'));
    assert(nonFaviconErrors.length === 0, 'Zero Console Errors during full lifecycle', nonFaviconErrors.join(' | '));

  } catch (err) {
    console.error(`💥 Unexpected test runner exception:`, err);
    testFailed++;
  } finally {
    await browser.close();
  }

  console.log(`\n==================================================`);
  console.log(`RESULT FOR ${targetName}: ${testPassed} PASSED, ${testFailed} FAILED`);
  console.log(`==================================================\n`);
  return { passed: testPassed, failed: testFailed, errors: [...pageErrors, ...consoleErrors] };
}

async function main() {
  // Test 1: Local Preview (Port 3001)
  const localResult = await runTestSuite(LOCAL_URL, 'Local Vite Preview Server');

  // Test 2: Live GitHub Pages
  const liveResult = await runTestSuite(LIVE_URL, 'Live GitHub Pages Deployment');

  console.log('\n==================================================');
  console.log('🏁 FINAL COMPREHENSIVE AUDIT REPORT');
  console.log('==================================================');
  console.log(`- Local Build:     ${localResult.passed} Passed, ${localResult.failed} Failed`);
  console.log(`- Live Deployment: ${liveResult.passed} Passed, ${liveResult.failed} Failed`);

  if (localResult.failed > 0 || liveResult.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
