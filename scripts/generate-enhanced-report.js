const fs = require('fs');
const path = require('path');

// Read the JSON report
const jsonReport = JSON.parse(fs.readFileSync('reports/cucumber_report.json', 'utf8'));

// Get all test cases from the report (flatten all elements from all entries)
const testCases = jsonReport.flatMap(entry => entry.elements || []);

// Function to generate report for a single test case
function generateTestCaseReport(testCase) {
  const scenarioName = testCase.name;
  const testCaseIdMatch = scenarioName.match(/^(TC\d+)/);
  const testCaseId = testCaseIdMatch ? testCaseIdMatch[1] : 'TC001';
  
  // Get screenshots for this test case
  const screenshotsDir = path.join(__dirname, `../screenshots/${testCaseId}`);
  if (!fs.existsSync(screenshotsDir)) {
    return null;
  }
  
  const allScreenshots = fs.readdirSync(screenshotsDir)
    .filter(file => file.endsWith('.png') && file.startsWith(`${testCaseId}_step_`));
  
  // Sort screenshots by step number
  const screenshots = allScreenshots.sort((a, b) => {
    const stepNumberA = a.match(/^TC\d+_step_(\d+)\.png$/)?.[1] || '999';
    const stepNumberB = b.match(/^TC\d+_step_(\d+)\.png$/)?.[1] || '999';
    return parseInt(stepNumberA) - parseInt(stepNumberB);
  });
  
  return { testCaseId, scenarioName, screenshots, testCase };
}

// Generate reports for all test cases
const testCaseReports = testCases.map(generateTestCaseReport).filter(report => report !== null);

// Function to get step name based on test case and step number
function getStepName(testCaseId, stepNumber) {
  const stepNames = {
    '01': 'Navigate to careers page',
    '02': testCaseId === 'TC001' ? 'Search for job title "Test" (After Search Click)' : 'Click on the job search input field to open dropdown',
    '03': testCaseId === 'TC001' ? 'Verify multiple locations in results' : 'Select "Sales" from the dropdown menu',
    '04': testCaseId === 'TC001' ? 'Open country filter' : 'Verify on Sales jobs page',
    '05': testCaseId === 'TC001' ? 'Select Netherlands from filter' : 'Verify "Sales" category is selected',
    '06': testCaseId === 'TC001' ? 'Verify filtered results' : 'Verify job count matches category count',
    '07': testCaseId === 'TC002' ? 'Select "Germany" from the country filter on Sales page' : '',
    '08': testCaseId === 'TC002' ? 'Verify filtered job count matches Germany count' : ''
  };
  return stepNames[stepNumber] || 'Step ' + stepNumber;
}

// Create enhanced HTML report
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Just Eat Takeaway QA Challenge - Detailed Report</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .screenshot-container {
            margin: 20px 0;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background: #f8f9fa;
        }
        .screenshot-img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .step-info {
            background: #e3f2fd;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .timestamp {
            color: #666;
            font-size: 0.9em;
        }
        .report-header {
            background-color: #f0f0f0;
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 30px;
        }
        .test-case-section {
            margin-bottom: 50px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
        }
        .test-case-header {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row report-header">
            <div class="col-12">
                <h1 class="text-center">Just Eat Takeaway QA Challenge - Detailed Report</h1>
                <p class="lead text-center">Detailed execution report with step-by-step screenshots</p>
                <p class="text-center"><strong>Total Test Cases:</strong> ${testCaseReports.length} | <strong>Executed At:</strong> ${new Date().toLocaleString()}</p>
            </div>
        </div>
        
        ${testCaseReports.map(({ testCaseId, scenarioName, screenshots, testCase }) => {
            const isPassed = testCase.steps.every(s => s.result?.status === 'passed');
            
            return `
            <div class="test-case-section">
                <div class="test-case-header">
                    <h2>${scenarioName}</h2>
                    <p><strong>Status:</strong> <span class="badge ${isPassed ? 'bg-success' : 'bg-danger'}">${isPassed ? 'Passed' : 'Failed'}</span></p>
                    <p><strong>Steps:</strong> ${testCase.steps.length} | <strong>Screenshots:</strong> ${screenshots.length}</p>
                </div>
                
                <div class="row">
                    <div class="col-md-8">
                        <h3>Step-by-Step Screenshots (In Execution Order)</h3>
                        ${screenshots.map(screenshot => {
                            // Extract step number from TCXXX format
                            const stepMatch = screenshot.match(/^TC\d+_step_(\d+)\.png$/);
                            const stepNumber = stepMatch ? stepMatch[1] : '?';
                            const stepName = getStepName(testCaseId, stepNumber);
                            
                            return `
                            <div class="screenshot-container">
                                <div class="step-info">
                                    <h5>Step ${stepNumber}: ${stepName}</h5>
                                    <div class="timestamp">Current test run</div>
                                </div>
                                <img src="../screenshots/${testCaseId}/${screenshot}" alt="Step ${stepNumber}: ${stepName}" class="screenshot-img">
                            </div>
                            `;
                        }).join('')}
                    </div>
                    
                    <div class="col-md-4">
                        <h4>Test Information</h4>
                        <div class="card">
                            <div class="card-body">
                                <h6>Environment</h6>
                                <ul class="list-unstyled">
                                    <li>Browser: Playwright Chromium</li>
                                    <li>Platform: Windows</li>
                                    <li>Framework: TypeScript + Playwright + Cucumber</li>
                                    <li>Mode: Headed (Visible Browser)</li>
                                </ul>
                                
                                <h6 class="mt-3">Screenshots</h6>
                                <ul class="list-unstyled">
                                    <li>Total: ${screenshots.length} screenshots</li>
                                    <li>Type: Step-level screenshots</li>
                                    <li>Location: screenshots/${testCaseId}/ folder</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h4 class="mt-4">Quick Links</h4>
                        <div class="list-group">
                            ${screenshots.map(screenshot => {
                                const stepMatch = screenshot.match(/^TC\d+_step_(\d+)\.png$/);
                                const stepNumber = stepMatch ? stepMatch[1] : '?';
                                const stepName = getStepName(testCaseId, stepNumber);
                                
                                return `
                                <a href="../screenshots/${testCaseId}/${screenshot}" class="list-group-item list-group-item-action" target="_blank">
                                    Step ${stepNumber}: ${stepName}
                                </a>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('')}
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

fs.writeFileSync('reports/enhanced_report.html', htmlContent);
console.log(`✅ Enhanced HTML report with screenshots generated for ${testCaseReports.length} test cases: reports/enhanced_report.html`);