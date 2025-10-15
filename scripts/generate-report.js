const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber_report.json',
  output: 'reports/cucumber_report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "QA",
    "Browser": "Playwright Chromium",
    "Platform": "Windows",
    "Framework": "TypeScript + Playwright + Cucumber",
    "Screenshots": "Available in screenshots/ folder"
  },
  failedSummaryReport: true,
  name: 'Just Eat Takeaway QA Challenge - Automation Report',
  // Add custom CSS to include screenshot information
  customData: {
    title: 'Screenshot Information',
    data: [
      { label: 'Screenshots Location', value: 'screenshots/ folder' },
      { label: 'Screenshot Count', value: '7 screenshots captured' },
      { label: 'Screenshot Types', value: 'Step-level + Final result' }
    ]
  }
};

try {
  reporter.generate(options);
  console.log('✅ HTML report generated successfully: reports/cucumber_report.html');
} catch (error) {
  console.error('❌ Error generating report:', error.message);
}

