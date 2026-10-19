import puppeteer from 'puppeteer-core';
import fs from 'fs';

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
  page.on('requestfailed', req => consoleLogs.push(`[REQ_FAILED] ${req.url()}: ${req.failure()?.errorText}`));

  console.log('Navigating to http://localhost:5173/ ...');
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }

  // Wait 4 seconds for full agent execution cycle to complete
  await new Promise(r => setTimeout(r, 4500));

  // Capture main trace screenshot
  const screenshotPath = './ui_snapshot.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved main screenshot to:', screenshotPath);

  // Tab: AI Copilot & Risk Brain
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const copilotTab = tabs.find(b => b.innerText.includes('AI Copilot'));
    if (copilotTab) copilotTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: './ui_copilot.png' });
  console.log('Saved AI copilot screenshot to: ./ui_copilot.png');

  // Tab 2: Discrepancy Matrix
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const matrixTab = tabs.find(b => b.innerText.includes('Discrepancy Matrix'));
    if (matrixTab) matrixTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './ui_matrix.png' });

  // Tab 3: HITL Approvals
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const hitlTab = tabs.find(b => b.innerText.includes('HITL Approvals'));
    if (hitlTab) hitlTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './ui_hitl.png' });

  // Tab 5: TC1-TC4 Test Suite
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const testTab = tabs.find(b => b.innerText.includes('TC1–TC4 Test Suite'));
    if (testTab) testTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './ui_tests.png' });

  // Tab 6: Compliance Audit Report
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const repTab = tabs.find(b => b.innerText.includes('Compliance Audit Report'));
    if (repTab) repTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: './ui_report.png' });

  // Get DOM text
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('--- BODY TEXT PREVIEW ---');
  console.log(bodyText.slice(0, 800));

  console.log('--- CONSOLE LOGS ---');
  consoleLogs.forEach(l => console.log(l));

  await browser.close();
}

verify().catch(console.error);
