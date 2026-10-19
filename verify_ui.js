import puppeteer from 'puppeteer-core';

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleLogs.push(`[PAGE_ERROR] ${err.toString()}`));

  console.log('Navigating to http://localhost:5173/ ...');
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }

  // Wait 4 seconds for initial audit execution
  await new Promise(r => setTimeout(r, 4000));

  // 1. Capture pristine de-cluttered dashboard (Sidebar + Metric + Execution Stream)
  const screenshotPath = './ui_snapshot.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved pristine dashboard screenshot to:', screenshotPath);

  // 2. Trigger Interactive Spotlight Tour via the sidebar button
  await page.evaluate(() => {
    const tourBtn = document.querySelector('button[title="Start Interactive Tour"]');
    if (tourBtn) tourBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_tour.png' });
  console.log('Saved Interactive Spotlight Tour screenshot to: ./ui_tour.png');

  // Close tour
  await page.evaluate(() => {
    const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Skip Tour'));
    if (skipBtn) skipBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 3. Tab: AI Security Copilot (Gemini 3.5 Flash-Lite)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const copilotTab = buttons.find(b => b.innerText.includes('AI Security Copilot'));
    if (copilotTab) copilotTab.click();
  });
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: './ui_copilot.png' });
  console.log('Saved AI copilot screenshot to: ./ui_copilot.png');

  // 4. Tab: Discrepancy Matrix
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const matrixTab = buttons.find(b => b.innerText.includes('Discrepancy Matrix'));
    if (matrixTab) matrixTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_matrix.png' });

  // 5. Tab: HITL Approvals
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const hitlTab = buttons.find(b => b.innerText.includes('HITL Approvals'));
    if (hitlTab) hitlTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_hitl.png' });

  // 6. Tab: Test Suite
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const testTab = buttons.find(b => b.innerText.includes('Test Suite'));
    if (testTab) testTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_tests.png' });

  // 7. Tab: Compliance Report
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const repTab = buttons.find(b => b.innerText.includes('Compliance Report'));
    if (repTab) repTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_report.png' });

  // 8. Test Logout -> Login Screen
  await page.evaluate(() => {
    const logoutBtn = document.querySelector('button[title="Sign out of audit console"]');
    if (logoutBtn) logoutBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_login.png' });
  console.log('Saved Login Page screenshot to: ./ui_login.png');

  // 9. Re-login via Quick Demo Login
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const quickLoginBtn = buttons.find(b => b.innerText.includes('One-Click Demo Login'));
    if (quickLoginBtn) quickLoginBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await browser.close();
  console.log('Verification run successfully finished.');
}

verify().catch(console.error);
