const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../report_assets/screenshots');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BASE_URL = 'http://127.0.0.1:8000';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  console.log('[*] Launching Chromium browser via Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/home/sambit/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1050'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });

  // 1. Capture Login Page
  console.log('[1/12] Capturing 01_login_page.png...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
  await sleep(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_login_page.png') });

  // Helper function to navigate via React Router by clicking sidebar links
  async function navigateTo(linkText) {
    console.log(`[*] Navigating to ${linkText}...`);
    await page.evaluate((text) => {
      const links = Array.from(document.querySelectorAll('nav a, aside a, header a'));
      const match = links.find((l) => l.innerText.trim().toLowerCase().includes(text.toLowerCase()));
      if (match) {
        match.click();
      } else {
        console.warn('Could not find link for', text);
      }
    }, linkText);
    await sleep(2000);
  }

  // Helper to close any open modal
  async function closeModal() {
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button'));
      const closeBtn = closeButtons.find(
        (b) =>
          b.innerText.trim().toLowerCase() === 'close' ||
          b.innerText.trim().toLowerCase() === 'cancel' ||
          b.querySelector('svg.lucide-x')
      );
      if (closeBtn) closeBtn.click();
    });
    await sleep(600);
  }

  // Perform Login as admin
  console.log('[*] Performing login as admin...');
  await page.type('input[type="text"], input[name="username"]', 'admin');
  await page.type('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await sleep(2500);

  // 2. Capture Executive SOC Dashboard
  console.log('[2/12] Capturing 02_dashboard_overview.png...');
  await navigateTo('Security Dashboard');
  await sleep(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_dashboard_overview.png') });

  // 3. Capture Device Registry (Fleet Management)
  console.log('[3/12] Capturing 03_device_management.png...');
  await navigateTo('Device Registry');
  await sleep(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_device_management.png') });

  // 4. Capture Enrolment Modal
  console.log('[4/12] Capturing 04_device_enrolment_modal.png...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.textContent && b.textContent.includes('Enrol New Biochip'));
    if (btn) btn.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_device_enrolment_modal.png') });
  await closeModal();

  // 5. Capture Key Lifecycle & Sessions
  console.log('[5/12] Capturing 05_session_governance.png...');
  await navigateTo('Key Lifecycle');
  await sleep(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_session_governance.png') });

  // 6. Capture Deep Session Inspector Modal
  console.log('[6/12] Capturing 06_session_deep_inspector.png...');
  const openedInspector = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const inspectBtn = buttons.find(
      (b) => b.getAttribute('title') && b.getAttribute('title').includes('Inspect cryptographic parameters')
    );
    if (inspectBtn) {
      inspectBtn.click();
      return true;
    }
    // Fallback: click inspect icon on first row
    const rowBtn = document.querySelector('table tbody tr button');
    if (rowBtn) {
      rowBtn.click();
      return true;
    }
    return false;
  });
  console.log('[*] Opened session inspector:', openedInspector);
  await sleep(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_session_deep_inspector.png') });
  await closeModal();

  // 7. Capture Clinician Diagnostics (Doctor Portal)
  console.log('[7/12] Capturing 07_doctor_portal_telemetry.png...');
  await navigateTo('Clinician Diagnostics');
  await sleep(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_doctor_portal_telemetry.png') });

  // 8. Capture Clinical Intervention Modal
  console.log('[8/12] Capturing 08_clinical_dispense_modal.png...');
  const openedIntervention = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.textContent && b.textContent.includes('Order Clinical Intervention'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('[*] Opened clinical intervention modal:', openedIntervention);
  await sleep(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_clinical_dispense_modal.png') });
  await closeModal();

  // 9. Capture DMFB Digital Twin
  console.log('[9/12] Capturing 09_dmfb_twin_simulation.png...');
  await navigateTo('DMFB Digital Twin');
  await sleep(1500);
  // Trigger assay simulation to activate droplets & electrodes
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const runBtn = buttons.find((b) => b.textContent && b.textContent.includes('Run Assay'));
    if (runBtn) runBtn.click();
  });
  await sleep(2500); // Wait for simulation animation
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_dmfb_twin_simulation.png') });

  // 10. Capture Forensic Audit Ledger
  console.log('[10/12] Capturing 10_audit_ledger.png...');
  await navigateTo('Forensic Audit Ledger');
  await sleep(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_audit_ledger.png') });

  // 11. Capture Audit Tamper Sandbox Modal
  console.log('[11/12] Capturing 11_audit_tamper_sandbox.png...');
  const openedTamper = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.textContent && b.textContent.includes('Tamper Sandbox'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('[*] Opened tamper sandbox modal:', openedTamper);
  await sleep(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '11_audit_tamper_sandbox.png') });
  await closeModal();

  // 12. Capture Performance Telemetry & Benchmarks
  console.log('[12/12] Capturing 12_benchmarks_primitives.png...');
  await navigateTo('Performance Telemetry');
  await sleep(2500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '12_benchmarks_primitives.png') });

  await browser.close();
  console.log('[✓] All 12 screenshots refreshed and captured successfully!');
})();
