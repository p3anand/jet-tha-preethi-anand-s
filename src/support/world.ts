import { setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, Browser, Page, BrowserContext } from 'playwright';

export interface CustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  headless: boolean;
  openBrowser(): Promise<void>;
  closeBrowser(): Promise<void>;
  takeScreenshot(name: string): Promise<void>;
}

class CustomWorldImpl extends World implements CustomWorld {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  headless: boolean = true;

  constructor(options: any) {
    super(options);
    this.browser = null as any;
    this.context = null as any;
    this.page = null as any;
    
    if (options.parameters) {
      let params;
      if (typeof options.parameters === 'string') {
        params = JSON.parse(options.parameters);
      } else {
        params = options.parameters;
      }
      this.headless = params.headless !== false;
    }
  }

  async openBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: this.headless
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(30000);
    this.page.setDefaultNavigationTimeout(30000);
  }

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

setWorldConstructor(CustomWorldImpl);
