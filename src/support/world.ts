import { setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, Browser, Page, BrowserContext } from 'playwright';

/**
 * Custom World interface that extends Cucumber's World with Playwright browser capabilities
 * Provides browser, context, and page objects for test automation
 */
export interface CustomWorld extends World {
  browser: Browser;           // Playwright browser instance
  context: BrowserContext;    // Browser context for isolation
  page: Page;                 // Main page object for interactions
  headless: boolean;          // Browser mode configuration
  openBrowser(): Promise<void>;      // Initialize browser and page
  closeBrowser(): Promise<void>;     // Clean up browser resources
  takeScreenshot(name: string): Promise<void>;  // Capture screenshots
}

/**
 * Implementation of CustomWorld that manages Playwright browser lifecycle
 * Handles browser initialization, configuration, and cleanup
 */
class CustomWorldImpl extends World implements CustomWorld {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  headless: boolean = true;  // Default to headless mode

  constructor(options: any) {
    super(options);
    // Initialize browser objects as null (will be set in openBrowser)
    this.browser = null as any;
    this.context = null as any;
    this.page = null as any;
    
    // Parse parameters to determine browser mode (headless/headed)
    if (options.parameters) {
      let params;
      if (typeof options.parameters === 'string') {
        params = JSON.parse(options.parameters);
      } else {
        params = options.parameters;
      }
      this.headless = params.headless !== false;  // Default to headless unless explicitly set to false
    }
  }

  // Initialize Playwright browser, context, and page with default settings
  async openBrowser(): Promise<void> {
    // Launch Chromium browser in headless or headed mode
    this.browser = await chromium.launch({
      headless: this.headless
    });

    // Create new browser context with standard viewport
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    // Create new page and set default timeouts
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(30000);        // 30s timeout for actions
    this.page.setDefaultNavigationTimeout(30000);  // 30s timeout for navigation
  }

  // Clean up browser resources in reverse order
  async closeBrowser(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Capture full-page screenshot and save to screenshots directory
  async takeScreenshot(name: string): Promise<void> {
    if (this.page) {
      const filename = `screenshots/${name}.png`;
      
      await this.page.screenshot({ 
        path: filename, 
        fullPage: true 
      });
    }
  }
}

// Register the custom world implementation with Cucumber
setWorldConstructor(CustomWorldImpl);
