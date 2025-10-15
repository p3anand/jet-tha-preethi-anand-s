import { Before, After, BeforeStep, AfterStep, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import * as fs from 'fs';
import * as path from 'path';

// Global step counter
let stepCounter = 0;

Before(async function (this: CustomWorld) {
  console.log('🚀 Starting test execution...');
  stepCounter = 0; // Reset step counter for each test
  
  // Clear old screenshots for current test case before starting new test
  const testCaseDir = path.join(__dirname, '../../screenshots/TC002');
  if (fs.existsSync(testCaseDir)) {
    const files = fs.readdirSync(testCaseDir);
    files.forEach(file => {
      if (file.endsWith('.png')) {
        fs.unlinkSync(path.join(testCaseDir, file));
      }
    });
  } else {
    // Create TC002 directory if it doesn't exist
    fs.mkdirSync(testCaseDir, { recursive: true });
  }
  
  await this.openBrowser();
});

AfterStep(async function (this: CustomWorld, step) {
  // Increment step counter for each step
  stepCounter++;
  
  // Skip screenshot for step 2 as it's taken manually in the Page Object Model
  if (stepCounter !== 2) {
    // Take screenshot after each step with test case prefix
    await this.takeScreenshot(`TC002/TC002_step_${stepCounter.toString().padStart(2, '0')}`);
  }
});

After(async function (this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name.replace(/\s+/g, '_');
  
  // Take screenshot only for failed tests
  if (scenario.result?.status === Status.FAILED) {
    console.log(`❌ Test failed: ${scenarioName}`);
    await this.takeScreenshot(`TC002/TC002_failed`);
  } else if (scenario.result?.status === Status.PASSED) {
    console.log(`✅ Test passed: ${scenarioName}`);
    // No screenshot for passed tests - step screenshots are sufficient
  }


  await this.closeBrowser();
  console.log('🏁 Test execution completed');
});
