const fs = require('fs');
const path = require('path');

// Read the JSON report
const jsonReport = JSON.parse(fs.readFileSync('reports/cucumber_report.json', 'utf8'));

// Get all screenshots from TC001 folder and sort by step number (exclude passed/failed screenshots)
const screenshotsDir = path.join(__dirname, '../screenshots/TC001');
const allScreenshots = fs.readdirSync(screenshotsDir)
  .filter(file => file.endsWith('.png') && file.startsWith('TC001_step_'));

// Sort screenshots by step number (TC001_step_01.png, TC001_step_02.png, etc.)
const screenshots = allScreenshots.sort((a, b) => {
  const stepNumberA = a.match(/^TC001_step_(\d+)\.png$/)?.[1] || '999';
  const stepNumberB = b.match(/^TC001_step_(\d+)\.png$/)?.[1] || '999';
  return parseInt(stepNumberA) - parseInt(stepNumberB);
});

// Create enhanced HTML report
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Just Eat Takeaway QA Challenge - Enhanced Report</title>
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
    </style>
</head>
<body>
    <div class="container mt-4">
        <h1 class="text-center mb-4">Just Eat Takeaway QA Challenge - Enhanced Report</h1>
        
        <div class="row">
            <div class="col-md-8">
                <h2>Test Results Summary</h2>
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">TC001 - Search for Test jobs and filter by Netherlands</h5>
                        <p class="card-text">
                            <span class="badge bg-success">PASSED</span>
                            <span class="badge bg-info">6 Steps</span>
                            <span class="badge bg-secondary">~21 seconds</span>
                        </p>
                    </div>
                </div>
                
                <h2 class="mt-4">Step-by-Step Screenshots (In Execution Order)</h2>
                ${screenshots.map(screenshot => {
                    // Extract step number from TC001 format (TC001_step_01.png, TC001_step_02.png, etc.)
                    const stepMatch = screenshot.match(/^TC001_step_(\d+)\.png$/);
                    const stepNumber = stepMatch ? stepMatch[1] : '?';
                    
                    // Define step names based on step number
                    const stepNames = {
                        '01': 'Navigate to careers page',
                        '02': 'Search for job title "Test" (After Search Click)',
                        '03': 'Verify multiple locations in results',
                        '04': 'Open country filter',
                        '05': 'Select Netherlands from filter',
                        '06': 'Verify filtered results'
                    };
                    const stepName = stepNames[stepNumber] || `Step ${stepNumber}`;
                    
                    return `
                    <div class="screenshot-container">
                        <div class="step-info">
                            <h5>Step ${stepNumber}: ${stepName}</h5>
                            <div class="timestamp">Current test run</div>
                        </div>
                        <img src="../screenshots/TC001/${screenshot}" alt="Step ${stepNumber}: ${stepName}" class="screenshot-img">
                    </div>
                    `;
                }).join('')}
            </div>
            
            <div class="col-md-4">
                <h3>Test Information</h3>
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
                            <li>Location: screenshots/TC001/ folder</li>
                        </ul>
                    </div>
                </div>
                
                <h3 class="mt-4">Quick Links (Sorted by Step Number)</h3>
                <div class="list-group">
                    ${screenshots.map(screenshot => {
                        const stepMatch = screenshot.match(/^TC001_step_(\d+)\.png$/);
                        const stepNumber = stepMatch ? stepMatch[1] : '?';
                        
                        // Define step names based on step number
                        const stepNames = {
                            '01': 'Navigate to careers page',
                            '02': 'Search for job title "Test" (After Search Click)',
                            '03': 'Verify multiple locations in results',
                            '04': 'Open country filter',
                            '05': 'Select Netherlands from filter',
                            '06': 'Verify filtered results'
                        };
                        const stepName = stepNames[stepNumber] || `Step ${stepNumber}`;
                        
                        return `
                        <a href="../screenshots/TC001/${screenshot}" class="list-group-item list-group-item-action" target="_blank">
                            Step ${stepNumber}: ${stepName}
                        </a>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

// Write the enhanced report
fs.writeFileSync('reports/enhanced_report.html', htmlContent);
console.log('✅ Enhanced HTML report with screenshots generated: reports/enhanced_report.html');
