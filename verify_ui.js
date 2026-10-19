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

  // 1. Capture pristine 1:1 AtherPanel Dashboard
  await page.screenshot({ path: './ui_dashboard.png' });
  console.log('Saved pristine AtherPanel dashboard screenshot to: ./ui_dashboard.png');

  // 2. Open Settings (AtherPanel 1:1 Settings Page)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const settingsBtn = buttons.find(b => b.innerText.includes('Settings') || b.title === 'Settings');
    if (settingsBtn) settingsBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_settings.png' });
  console.log('Saved AtherPanel Settings page screenshot to: ./ui_settings.png');

  // Switch to "Test Credentials" in Settings
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const credBtn = buttons.find(b => b.innerText.includes('Test Credentials'));
    if (credBtn) credBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './ui_settings_credentials.png' });
  console.log('Saved Settings Test Credentials screenshot to: ./ui_settings_credentials.png');

  // Click "Back to workspace" button in Settings
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const backBtn = buttons.find(b => b.innerText.includes('Back to workspace'));
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 3. Trigger Interactive Spotlight Tour via the sidebar button
  await page.evaluate(() => {
    const tourBtn = document.querySelector('button[title="Start Interactive Tour"]');
    if (tourBtn) tourBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_tour.png' });
  console.log('Saved Interactive Spotlight Tour screenshot to: ./ui_tour.png');

  // Close tour via Skip
  await page.evaluate(() => {
    const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Skip'));
    if (skipBtn) skipBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 4. Tab: Agent Blueprint
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const agentTab = buttons.find(b => b.innerText.includes('Agent Blueprint'));
    if (agentTab) agentTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './ui_snapshot.png' });
  console.log('Saved Agent Execution Stream screenshot to: ./ui_snapshot.png');

  // 5. Tab: AI Security Copilot (Gemini 3.5 Flash-Lite)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const copilotTab = buttons.find(b => b.innerText.includes('AI Security Copilot'));
    if (copilotTab) copilotTab.click();
  });
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: './ui_copilot.png' });
  console.log('Saved AI copilot screenshot to: ./ui_copilot.png');

  // 6. Tab: Discrepancy Matrix (Expand one row to test dropdown)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const matrixTab = buttons.find(b => b.innerText.includes('Discrepancy Matrix'));
    if (matrixTab) matrixTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  // Click first evidence button
  await page.evaluate(() => {
    const evidenceBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Evidence'));
    if (evidenceBtn) evidenceBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: './ui_matrix.png' });
  console.log('Saved Discrepancy Matrix (with dropdown expanded) screenshot to: ./ui_matrix.png');

  // 7. Tab: HITL Approvals
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const hitlTab = buttons.find(b => b.innerText.includes('HITL Approvals'));
    if (hitlTab) hitlTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './ui_hitl.png' });
  console.log('Saved HITL Approvals screenshot to: ./ui_hitl.png');

  // 8. Tab: Test Suite
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const testTab = buttons.find(b => b.innerText.includes('Test Suite'));
    if (testTab) testTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './ui_tests.png' });
  console.log('Saved Test Suite screenshot to: ./ui_tests.png');

  // 9. Tab: Compliance Report
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const repTab = buttons.find(b => b.innerText.includes('Compliance Report'));
    if (repTab) repTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './ui_report.png' });
  console.log('Saved Compliance Report screenshot to: ./ui_report.png');

  // 10. Test Logout -> AtherPanel Login Screen
  await page.evaluate(() => {
    const logoutBtn = document.querySelector('button[title="Sign out of audit console"]');
    if (logoutBtn) logoutBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_login.png' });
  console.log('Saved Login Page screenshot to: ./ui_login.png');

  // 11. Trigger Demo Login to verify Onboarding Prompt Modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const quickLoginBtn = buttons.find(b => b.innerText.includes('One-Click Demo Login'));
    if (quickLoginBtn) quickLoginBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_onboarding_modal.png' });
  console.log('Saved Onboarding Modal Prompt screenshot to: ./ui_onboarding_modal.png');

  // Dismiss onboarding modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dismissBtn = buttons.find(b => b.innerText.includes('Go Straight to Dashboard'));
    if (dismissBtn) dismissBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await browser.close();
  console.log('All verification snapshots completed successfully.');
}

verify().catch(console.error);
