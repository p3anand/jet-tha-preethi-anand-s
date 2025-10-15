# Just Eat Takeaway QA Challenge

A test automation framework built with **Playwright**, **TypeScript**, **Cucumber**, and **BDD** for testing Just Eat Takeaway's careers website functionality.

## Features

- **BDD Framework**: Gherkin/Cucumber for human-readable test scenarios
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Visual Testing**: Step-by-step screenshots for each test execution
- **Comprehensive Reporting**: HTML reports with embedded screenshots
- **Page Object Model**: Clean, maintainable test architecture
- **Multiple Test Cases**: TC001 (Job Search & Filtering) and TC002 (Sales Job Filtering)

## Test Cases

### TC001: Job Search and Country Filtering
- Navigate to careers page
- Search for "Test" jobs
- Verify multiple locations in results
- Filter by Netherlands
- Verify filtered results

### TC002: Sales Job Filtering with Dropdown Selection
- Navigate to careers page
- Open job category dropdown
- Select "Sales" category
- Verify Sales jobs page and category selection
- Filter by Germany
- Verify filtered results

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/p3anand/jet-ta.git
cd jet-ta
```

### 2. Install Dependencies
```bash
npm install
```

## Running Tests

### Run All Tests
```bash
# Headless mode (faster, no browser window)
npm test

# Headed mode (visible browser window)
npm run test:headed
```

### Run Individual Test Cases
```bash
# TC001 only
npm run tc001:headed

# TC002 only
npm run tc002:headed
```

### Generate Reports
```bash
# Standard Cucumber HTML report
npm run report

# Enhanced report with screenshots
npm run report:enhanced
```

## Project Structure

```
jet-ta/
├── src/
│   ├── features/                 # Gherkin feature files
│   │   ├── career_search.feature
│   │   └── sales_job_filtering.feature
│   ├── pages/                    # Page Object Models
│   │   ├── CareersPage.ts
│   │   └── SalesJobsPage.ts
│   ├── step-definitions/         # Cucumber step definitions
│   │   ├── career_search.steps.ts
│   │   └── sales_job_filtering.steps.ts
│   └── support/                  # Test support files
│       ├── hooks.ts              # Cucumber hooks
│       └── world.ts              # Custom world implementation
├── screenshots/                  # Test execution screenshots
│   ├── TC001/
│   └── TC002/
├── reports/                      # Generated test reports
│   ├── cucumber_report.html
│   ├── cucumber_report.json
│   └── enhanced_report.html
├── scripts/                      # Utility scripts
│   ├── generate-report.js        # Standard report generator
│   └── generate-enhanced-report.js # Enhanced report with screenshots
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Dependency lock file
├── cucumber.js                   # Cucumber configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## Platform-Specific Instructions

### Windows

#### Prerequisites Installation
1. **Install Node.js**:
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS version
   - Run the installer with default settings

2. **Verify Installation**:
   ```cmd
   node --version
   npm --version
   ```

3. **Install Git** (if not already installed):
   - Download from [git-scm.com](https://git-scm.com/)
   - Run installer with default settings

#### Running Tests
```cmd
# Navigate to project directory
cd jet-ta

# Install dependencies
npm install

# Run tests
npm run test:headed
```

### macOS

#### Prerequisites Installation
1. **Install Node.js** (using Homebrew - recommended):
   ```bash
   # Install Homebrew (if not already installed)
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install Node.js
   brew install node
   ```

2. **Alternative - Direct Download**:
   - Download from [nodejs.org](https://nodejs.org/)
   - Run the `.pkg` installer

3. **Verify Installation**:
   ```bash
   node --version
   npm --version
   ```

#### Running Tests
```bash
# Navigate to project directory
cd jet-ta

# Install dependencies
npm install

# Run tests
npm run test:headed
```

### Linux (Ubuntu/Debian)

#### Prerequisites Installation
1. **Install Node.js**:
   ```bash
   # Update package index
   sudo apt update
   
   # Install Node.js and npm
   sudo apt install nodejs npm
   
   # Verify versions (should be v16+)
   node --version
   npm --version
   ```

2. **Install Git** (if not already installed):
   ```bash
   sudo apt install git
   ```

#### Running Tests
```bash
# Navigate to project directory
cd jet-ta

# Install dependencies
npm install

# Run tests
npm run test:headed
```

## Test Reports

After running tests, you'll find reports in the `reports/` directory:

- **`cucumber_report.html`**: Standard Cucumber HTML report
- **`enhanced_report.html`**: Enhanced report with embedded screenshots

## Screenshots

Test execution screenshots are automatically captured and stored in:
- `screenshots/TC001/` - TC001 test screenshots
- `screenshots/TC002/` - TC002 test screenshots

Each screenshot is named with the step number for easy identification.

## Configuration

### Browser Configuration
- **Default**: Chromium (headless mode)
- **Headed Mode**: Visible browser window for debugging
- **Viewport**: 1920x1080
- **Timeout**: 30 seconds for actions and navigation

### Test Configuration
- **Framework**: Cucumber with TypeScript
- **Browser**: Playwright Chromium
- **Screenshots**: Full page captures
- **Reports**: HTML with embedded images

---

