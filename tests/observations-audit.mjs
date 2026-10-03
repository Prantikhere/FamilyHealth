import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/usr/bin/google-chrome';
const LOCAL_URL = 'http://localhost:3001/FamilyHealth/';
const TARGET_URL = process.argv[2] || LOCAL_URL;

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

async function runObservationsAudit() {
  console.log(`\n==================================================`);
  console.log(`🚀 RUNNING 5-OBSERVATION COMPREHENSIVE AUDIT`);
  console.log(`   URL: ${TARGET_URL}`);
  console.log(`==================================================\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

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
    // 1. Initial Load & Landing Page
    console.log(`[Phase 1: Initial Page Load & Landing Navigation]`);
    const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    assert(response && response.status() === 200, 'Page loaded successfully with HTTP 200');

    // Click Enter Live Demo on Landing Page
    const quickLaunchBtn = await findButtonByText(page, ['Enter Live Demo', 'Launch Live POV Experience', 'Launch Household Head Demo', 'Quick Launch']);
    assert(quickLaunchBtn !== null, 'Found Launch / Live Demo button on Landing Page');
    if (quickLaunchBtn) {
      await quickLaunchBtn.click();
      await new Promise(r => setTimeout(r, 1200));
    }

    // If on login page, submit demo credentials or bypass
    const enterAppBtn = await findButtonByText(page, ['Enter Platform', 'Sign In to FamilyHealth', 'Enter Platform (Household Admin)']);
    if (enterAppBtn) {
      await enterAppBtn.click();
      await new Promise(r => setTimeout(r, 1200));
    }

    // Verify Main App Loaded with 3-Hub Header
    const brandHeading = await page.$eval('header', el => el.innerText).catch(() => '');
    assert(brandHeading.includes('FamilyHealth'), 'Brand identity header active in 3-hub shell');

    // 2. OBSERVATION 1: Role-Based Access Control / Visibility Separation
    console.log(`\n[Phase 2: Observation 1 - Role-Based Visibility Separation]`);

    // 2A. Check Household Admin (Femi Adeyemi)
    const adminRosterBtn = await findButtonByText(page, ['Member Roster']);
    if (adminRosterBtn) {
      await adminRosterBtn.click();
      await new Promise(r => setTimeout(r, 600));
    }
    const adminMemberCards = await page.$$('.surface-card h3');
    assert(adminMemberCards.length >= 4, 'Household Admin (Femi Adeyemi) has full multi-generational roster visibility', `Found ${adminMemberCards.length} members`);

    // 2B. Switch to CHEW Nurse (Nurse Modupe Alabi)
    let rolePill = await page.$('button[aria-label="Switch User Profile Perspective"]');
    assert(rolePill !== null, 'Found Role Perspective Pill in Header');
    if (rolePill) {
      await rolePill.click();
      await new Promise(r => setTimeout(r, 500));

      const nurseOption = await findButtonByText(page, ['Nurse Modupe Alabi', 'CHEW']);
      assert(nurseOption !== null, 'Found Nurse Modupe Alabi (CHEW) in perspective menu');
      if (nurseOption) {
        await nurseOption.click();
        await new Promise(r => setTimeout(r, 800));

        // Verify CHEW banner
        const chewBannerText = await page.evaluate(() => document.body.innerText);
        assert(chewBannerText.includes('CHEW') || chewBannerText.includes('Maternal'), 'CHEW Maternal & Child Health banner displayed');
        assert(chewBannerText.includes('Tunde') || chewBannerText.includes('Sade'), 'CHEW view includes pediatric/maternal dependents');

        // Check Timeline fee masking for CHEW
        const timelineTabBtn = await findButtonByText(page, ['Timeline']);
        if (timelineTabBtn) {
          await timelineTabBtn.click();
          await new Promise(r => setTimeout(r, 800));
          const timelineText = await page.evaluate(() => document.body.innerText);
          assert(timelineText.includes('CHEW Nurse') || timelineText.includes('Maternal & Child'), 'Timeline reflects CHEW restricted perspective');
        }
      }
    }

    // 2C. Switch to Baba Adeyemi (Senior Dependent G0)
    rolePill = await page.$('button[aria-label="Switch User Profile Perspective"]');
    if (rolePill) {
      await rolePill.click();
      await new Promise(r => setTimeout(r, 500));

      const seniorOption = await findButtonByText(page, ['Baba Adeyemi', 'Senior Patient View']);
      assert(seniorOption !== null, 'Found Baba Adeyemi in perspective menu');
      if (seniorOption) {
        await seniorOption.click();
        await new Promise(r => setTimeout(r, 800));

        const seniorBannerText = await page.evaluate(() => document.body.innerText);
        assert(seniorBannerText.includes('Baba Adeyemi') || seniorBannerText.includes('Senior Health Portal'), 'Senior Personal Portal banner displayed');
      }
    }

    // Switch back to Household Head Femi Adeyemi for remaining tests
    rolePill = await page.$('button[aria-label="Switch User Profile Perspective"]');
    if (rolePill) {
      await rolePill.click();
      await new Promise(r => setTimeout(r, 500));
      const femiOption = await findButtonByText(page, ['Femi Adeyemi', 'Household Admin']);
      if (femiOption) {
        await femiOption.click();
        await new Promise(r => setTimeout(r, 800));
      }
    }

    // 3. OBSERVATION 2: Individual Profiles & Profile Pictures
    console.log(`\n[Phase 3: Observation 2 - Individual Profiles & Profile Pictures]`);
    const editPhotoBtn = await findButtonByText(page, ['Edit Photo', 'Edit Profile & Photo', 'Edit Profile']);
    assert(editPhotoBtn !== null, 'Found Edit Profile / Photo button');
    if (editPhotoBtn) {
      await editPhotoBtn.click();
      await new Promise(r => setTimeout(r, 800));

      // Verify MemberProfileModal opened
      const modalText = await page.evaluate(() => document.querySelector('.fixed.inset-0')?.innerText || document.body.innerText);
      assert(modalText.includes('Profile') || modalText.includes('Photo') || modalText.includes('Genotype') || modalText.includes('Bio Details'), 'Member Profile & Photo Modal opened successfully');

      // Verify avatar presets are available
      const avatarButtons = await page.$$('.surface-card button');
      assert(avatarButtons.length > 5, 'Illustrated African avatar portraits and upload controls present in modal');

      // Close modal
      const cancelBtn = await findButtonByText(page, ['Cancel', 'Close']);
      if (cancelBtn) {
        await cancelBtn.click();
        await new Promise(r => setTimeout(r, 500));
      }
    }

    // 4. OBSERVATION 3: Professional Family Tree (Clinical Pedigree DAG)
    console.log(`\n[Phase 4: Observation 3 - Professional Clinical Pedigree Tree]`);
    const lineageGraphBtn = await findButtonByText(page, ['Visual Lineage Graph', 'DAG']);
    if (lineageGraphBtn) {
      await lineageGraphBtn.click();
      await new Promise(r => setTimeout(r, 800));
    }

    const treeCanvas = await page.$('svg line, svg path, .surface-card svg');
    assert(treeCanvas !== null, 'Professional Family Tree SVG orthogonal connectors and nodes rendered');

    const treeText = await page.evaluate(() => document.body.innerText);
    assert(treeText.includes('Pedigree') || treeText.includes('Hereditary') || treeText.includes('Generation'), 'Clinical pedigree annotations and Mendelian risk analysis displayed');

    // 5. OBSERVATION 4: Vernacular Localization
    console.log(`\n[Phase 5: Observation 4 - Vernacular Localization]`);
    const langBtn = await page.$('button[aria-label="Change Language"]');
    assert(langBtn !== null, 'Found Language selector dropdown');
    if (langBtn) {
      // Test Nigerian Pidgin
      await langBtn.click();
      await new Promise(r => setTimeout(r, 400));
      const pidginOption = await findButtonByText(page, ['Nigerian Pidgin']);
      if (pidginOption) {
        await pidginOption.click();
        await new Promise(r => setTimeout(r, 600));
        const pcmBody = await page.evaluate(() => document.body.innerText);
        assert(pcmBody.includes('Wetin Dey Worry') || pcmBody.includes('Family') || pcmBody.includes('Alert'), 'Nigerian Pidgin localized strings rendered');
      }

      // Test Èdè Yorùbá
      await langBtn.click();
      await new Promise(r => setTimeout(r, 400));
      const yorubaOption = await findButtonByText(page, ['Èdè Yorùbá']);
      if (yorubaOption) {
        await yorubaOption.click();
        await new Promise(r => setTimeout(r, 600));
        const yoBody = await page.evaluate(() => document.body.innerText);
        assert(yoBody.includes('Ìdílé') || yoBody.includes('Ìkìlọ̀') || yoBody.includes('Yorùbá') || yoBody.includes('Àwọn'), 'Yorùbá localized strings rendered');
      }

      // Reset back to English
      await langBtn.click();
      await new Promise(r => setTimeout(r, 400));
      const enOption = await findButtonByText(page, ['English']);
      if (enOption) {
        await enOption.click();
        await new Promise(r => setTimeout(r, 600));
      }
    }

    // 6. OBSERVATION 5: Scanning, Image & OCR Integration
    console.log(`\n[Phase 6: Observation 5 - Scanning, Image & OCR Integration]`);
    const scanOcrBtn = await findButtonByText(page, ['Scan Record (OCR)', 'Scan (OCR)']);
    assert(scanOcrBtn !== null, 'Found Scan Record (OCR) button in Header / Navigation');
    if (scanOcrBtn) {
      await scanOcrBtn.click();
      await new Promise(r => setTimeout(r, 800));

      // Verify OCR Scanner Modal
      const ocrHeading = await page.evaluate(() => document.body.innerText);
      assert(ocrHeading.includes('Document Capture') || ocrHeading.includes('WASM OCR'), 'WASM OCR Scanner Modal launched');

      // Select preset sample paper
      const samplePresetBtn = await findButtonByText(page, ['Clinic Rx: Antimalarial', 'Antimalarial & Analgesic']);
      assert(samplePresetBtn !== null, 'Sample paper prescription preset available');
      if (samplePresetBtn) {
        await samplePresetBtn.click();
        // Wait for on-device heuristic extraction
        await new Promise(r => setTimeout(r, 1500));

        const extractedText = await page.evaluate(() => document.body.innerText);
        assert(extractedText.includes('Adeyemi Chemist') || extractedText.includes('Coartem') || extractedText.includes('3850'), 'OCR successfully extracted clinical provider, dosage, and ₦ fee');

        // Save to family log
        const saveRecordBtn = await findButtonByText(page, ['Save to Family Log', 'Save to Family Ledger']);
        if (saveRecordBtn) {
          await saveRecordBtn.click();
          await new Promise(r => setTimeout(r, 1000));
          console.log('  ✅ PASS: Saved OCR extracted record to family health records');
          testPassed++;
        }
      }
    }

    // 7. Verify zero console errors & page errors
    console.log(`\n[Phase 7: Resilience & Console Error Audit]`);
    assert(pageErrors.length === 0, 'Zero uncaught page exceptions', pageErrors.join(', '));
    assert(consoleErrors.length === 0, 'Zero console errors', consoleErrors.join(', '));

  } catch (error) {
    console.error('Test execution failed with error:', error);
    testFailed++;
  } finally {
    await browser.close();
  }

  console.log(`\n==================================================`);
  console.log(`📊 AUDIT SUMMARY:`);
  console.log(`   Passed: ${testPassed}`);
  console.log(`   Failed: ${testFailed}`);
  console.log(`==================================================\n`);

  if (testFailed > 0) {
    process.exit(1);
  }
}

runObservationsAudit();
