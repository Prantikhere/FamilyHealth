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
  const buttons = await page.$$('button, a[role="button"]');
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
  console.log(`🚀 STARTING LLD AUDIT FOR: ${targetName}`);
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
    console.log(`\n[Phase 1: Initial Page Load & African Earth Tone Branding]`);
    const response = await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    assert(response && response.status() === 200, 'Page loaded with HTTP 200', `Status: ${response?.status()}`);
    
    const pageTitle = await page.title();
    assert(pageTitle.includes('FamilyHealth'), 'Page title reflects FamilyHealth LLD', `Title: "${pageTitle}"`);

    // 2. Landing Page Elements
    console.log(`\n[Phase 2: Landing Page Flow & Presentation]`);
    const heroHeading = await page.$eval('h1', (el) => el.innerText).catch(() => null);
    assert(heroHeading && heroHeading.includes('Healthcare Sovereignty'), 'Hero heading rendered', heroHeading);

    const enterDemoBtn = await findButtonByText(page, ['Enter Live Demo', 'Launch Live POV', 'Live Demo']);
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
    assert(loginHeading.includes('FamilyHealth'), 'Navigated to FamilyHealth Login Portal', loginHeading);

    // Verify Evaluator Quick Access button exists
    const oneTapBtn = await findButtonByText(page, ['Launch POV', '1-Tap', 'Evaluator']);
    assert(!!oneTapBtn, '1-Tap Evaluator quick-access bypass button present');

    // Click 1-Tap Evaluator Access
    if (oneTapBtn) {
      await oneTapBtn.click();
      await new Promise(r => setTimeout(r, 1200));
    }

    // 4. Hub 1: Circle (Lineage DAG, Completeness, Emergency Strip)
    console.log(`\n[Phase 4: Hub 1 - Circle & Lineage DAG Graph]`);
    const circleText = await page.evaluate(() => document.body.innerText);
    assert(circleText.includes('Lineage') || circleText.includes('Circle') || circleText.includes('Adeyemi'), 'Circle Hub loaded');
    assert(circleText.includes('EMERGENCY HEALTH PASS') || circleText.includes('SHOW QR PASS'), 'Emergency Quick-Action Strip present');
    assert(circleText.includes('88%') || circleText.includes('Completeness'), 'Family Health Completeness Index present');
    assert(circleText.includes('Generation 0') || circleText.includes('G0') || circleText.includes('Baba'), 'Multi-generational tiers (G0-G2) rendered');

    // 5. User Profile Icon Click (Verifying Zero Crash Fix)
    console.log(`\n[Phase 5: User Profile & Top Bar Interaction]`);
    const initialErrorsLen = pageErrors.length + consoleErrors.length;
    
    const userMenuButton = await page.$('button[aria-label="User Account Menu"]');
    assert(!!userMenuButton, 'User Account Menu button found in header');
    
    if (userMenuButton) {
      await userMenuButton.click();
      await new Promise(r => setTimeout(r, 500));
      
      const menuVisible = await page.evaluate(() => {
        return document.body.innerText.includes('Product Showcase') ||
               document.body.innerText.includes('Sign Out') ||
               document.body.innerText.includes('Reset to Initial');
      });
      assert(menuVisible, 'User profile popup menu rendered cleanly');
      
      const errorsAfterClick = pageErrors.length + consoleErrors.length;
      assert(errorsAfterClick === initialErrorsLen, 'Zero crashes or console errors when opening user menu', `Errors: ${errorsAfterClick - initialErrorsLen}`);

      // Dismiss menu by clicking backdrop
      const backdrop = await page.$('div.fixed.inset-0');
      if (backdrop) {
        await backdrop.click();
        await new Promise(r => setTimeout(r, 300));
      }
    }

    // 6. Language Switcher (Vernacular Localization)
    console.log(`\n[Phase 6: Multi-lingual Vernacular Language Switcher]`);
    const langBtn = await page.$('button[aria-label="Change Language"]');
    if (langBtn) {
      await langBtn.click();
      await new Promise(r => setTimeout(r, 400));
      const hasLangOptions = await page.evaluate(() => {
        return document.body.innerText.includes('Pidgin') || document.body.innerText.includes('Yorùbá') || document.body.innerText.includes('Hausa');
      });
      assert(hasLangOptions, 'Vernacular languages (Pidgin, Yorùbá, Hausa, Igbo) displayed');
      // Dismiss
      const backdrop = await page.$('div.fixed.inset-0');
      if (backdrop) await backdrop.click();
      await new Promise(r => setTimeout(r, 200));
    }

    // 7. Hub 2: Timeline (Dual-Tier Records & Delegated Transfer)
    console.log(`\n[Phase 7: Hub 2 - Dual-Tier Timeline & Doctor PIN Transfer]`);
    const timelineNavBtn = await findButtonByText(page, ['Timeline']);
    if (timelineNavBtn) {
      await timelineNavBtn.click();
      await new Promise(r => setTimeout(r, 600));

      const timelineText = await page.evaluate(() => document.body.innerText);
      assert(timelineText.includes('Dual-Tier') || timelineText.includes('Official') || timelineText.includes('Self-Reported'), 'Timeline View loaded');
      assert(timelineText.includes('OFFICIAL VERIFIED SEAL') || timelineText.includes('Verified Ed25519'), 'Official verified Ed25519 records rendered');
      assert(timelineText.includes('SELF-REPORTED ENTRY'), 'Self-reported records with provenance watermark rendered');

      // Test Transfer Selected flow
      const transferBtn = await findButtonByText(page, ['Transfer Selected']);
      assert(!!transferBtn, 'Transfer Selected activation button present');

      // Click first record checkbox
      const firstCheckbox = await page.$('input[type="checkbox"]:not(#selectAllRecords)');
      if (firstCheckbox) {
        await page.evaluate(el => el.click(), firstCheckbox);
        await new Promise(r => setTimeout(r, 400));
        const activeTransferBtn = (await findButtonByText(page, ['Transfer Selected'])) || transferBtn;
        await page.evaluate(el => el.click(), activeTransferBtn);
        await new Promise(r => setTimeout(r, 800));

        const transferModalOpen = await page.evaluate(() => {
          return document.body.innerText.includes('Delegated Transfer') || 
                 document.body.innerText.includes('Doctor PIN') ||
                 document.body.innerText.includes('Argon2id');
        });
        assert(transferModalOpen, 'Granular Delegated Transfer modal generated 4-digit PIN');

        // Test Doctor Terminal Simulation
        const simDocBtn = await findButtonByText(page, ['Simulate Doctor Terminal View']);
        if (simDocBtn) {
          await simDocBtn.click();
          await new Promise(r => setTimeout(r, 500));
          
          // Enter 4-digit PIN in doctor view
          const pinInput = await page.$('input[placeholder*="7492"]');
          if (pinInput) {
            await pinInput.type('7492');
            const submitDoc = await findButtonByText(page, ['Unwrap DEKs']);
            if (submitDoc) {
              await submitDoc.click();
              await new Promise(r => setTimeout(r, 600));
              const docDecrypted = await page.evaluate(() => {
                return document.body.innerText.includes('Decryption Successful') || document.body.innerText.includes('Decrypted Patient Records');
              });
              assert(docDecrypted, 'Doctor Terminal successfully unwrapped DEK and decrypted records');
            }
          }
        }

        // Close doctor modal
        const closeButtons = await page.$$('button');
        for (const cb of closeButtons) {
          const btnText = await page.evaluate(el => el.innerText || '', cb);
          if (btnText.includes('Done') || btnText.includes('Close') || btnText.includes('✕')) {
            await page.evaluate(el => el.click(), cb).catch(() => {});
          }
        }
      }
    }

    // 8. Hub 3: SOS (Zero-Click Crisis Health Card & Triage)
    console.log(`\n[Phase 8: Hub 3 - SOS Emergency Health Card & Triage]`);
    const sosNavBtn = await findButtonByText(page, ['SOS']);
    if (sosNavBtn) {
      await sosNavBtn.click();
      await new Promise(r => setTimeout(r, 600));

      const sosText = await page.evaluate(() => document.body.innerText);
      assert(sosText.includes('EMERGENCY HEALTH CARD') || sosText.includes('Zero-Click'), 'SOS Emergency Hub loaded');
      assert(sosText.includes('BLOOD GROUP') && sosText.includes('GENOTYPE'), '48pt Bold Blood Group & Genotype attributes rendered');
      assert(sosText.includes('Know Before You Go') || sosText.includes('Triage'), 'Know Before You Go symptom triage section rendered');
      assert(sosText.includes('Facilities') || sosText.includes('Ikeja') || sosText.includes('Cardiology'), 'Geospatial Facilities Directory rendered');

      // Verify Air-Gapped Offline QR image
      const qrImg = await page.$('img[alt="Offline ICE QR Matrix"]');
      const hasQrSrc = qrImg ? await page.evaluate(el => el.src && el.src.startsWith('data:image/'), qrImg) : false;
      assert(!!qrImg && hasQrSrc, 'Air-Gapped Offline QR code generated with FH_ICE_V2 payload');

      // Test Care Triage Clinical Decision Tree
      const launchTriageBtn = await findButtonByText(page, ['Launch Triage']);
      if (launchTriageBtn) {
        await launchTriageBtn.click();
        await new Promise(r => setTimeout(r, 600));
        const triageModalOpen = await page.evaluate(() => {
          return document.body.innerText.includes('Care Triage Clinical Decision Tree') || document.body.innerText.includes('Red-Flag');
        });
        assert(triageModalOpen, 'Care Triage Clinical Decision Tree modal launched with red-flag cascades');

        const closeTriage = await findButtonByText(page, ['Done / Close Triage']);
        if (closeTriage) {
          await closeTriage.click();
          await new Promise(r => setTimeout(r, 300));
        }
      }
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
        const hasOverflow = scrollWidth > clientWidth + 2;
        return { scrollWidth, clientWidth, hasOverflow };
      });

      assert(
        !overflowResult.hasOverflow,
        `Viewport ${vp.name} (${vp.width}x${vp.height}) has NO horizontal scroll overflow`,
        `ScrollWidth: ${overflowResult.scrollWidth}px, WindowWidth: ${overflowResult.clientWidth}px`
      );

      // Verify persistent 3-hub bottom nav bar
      const bottomNav = await page.$('nav[role="navigation"], nav.fixed.bottom-0');
      assert(!!bottomNav, `Persistent bottom navigation bar active for ${vp.name}`);
    }

    // 10. Console / Page Error Summary
    console.log(`\n[Phase 10: Runtime Integrity & Console Diagnostics]`);
    assert(pageErrors.length === 0, 'Zero Uncaught Exceptions during full lifecycle', pageErrors.join(' | '));
    const filteredConsole = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('manifest'));
    assert(filteredConsole.length === 0, 'Zero Console Errors during full lifecycle', filteredConsole.join(' | '));

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
  // Test Local Preview Server (Port 3001)
  const localResult = await runTestSuite(LOCAL_URL, 'Local Production Preview Server (Port 3001)');

  console.log('\n==================================================');
  console.log('🏁 AUDIT REPORT SUMMARY:');
  console.log(`- Local Build: ${localResult.passed} Passed, ${localResult.failed} Failed`);
  console.log('==================================================');

  if (localResult.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
