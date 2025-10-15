import { Page, expect } from '@playwright/test';

export class CareersPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async navigateToCareersPage(): Promise<void> {
    await this.page.goto('https://careers.justeattakeaway.com/global/en/home');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Search functionality
  async searchForJobTitle(jobTitle: string): Promise<void> {
    // Wait for the search form to be visible
    await this.page.waitForSelector('input[placeholder="Search for job title"]');
    
    // Clear any existing text and fill the search input
    await this.page.fill('input[placeholder="Search for job title"]', '');
    await this.page.fill('input[placeholder="Search for job title"]', jobTitle);
    
    await this.page.click('#ph-search-backdrop');
    
    // Take screenshot immediately after search button click, before navigation
    await this.page.screenshot({ 
      path: 'screenshots/TC001/TC001_step_02.png', 
      fullPage: true 
    });
    
    // Wait for navigation to search results page
    await this.page.waitForURL('**/search-results**');
    
    // Wait for search results to load
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Filter functionality
  async openCountryFilter(): Promise<void> {
    await this.page.click('button[aria-label="Country"]');
    // Wait for filter options to appear
    await this.page.waitForSelector('input[type="checkbox"][aria-label*="Netherlands"]');
  }

  async selectCountryFilter(countryName: string): Promise<void> {
    // Use a dynamic selector that finds checkbox by country name without hardcoding job count
    const countryCheckbox = this.page.locator(`input[type="checkbox"][aria-label*="${countryName}"]`);
    await countryCheckbox.click();
    await this.page.waitForTimeout(1000);
  }

  // Verification methods
  async verifyPageTitle(): Promise<void> {
    const title = await this.page.title();
    expect(title).toContain('Just Eat Takeaway Careers');
  }

  async verifySearchResultsContainMultipleLocations(): Promise<void> {
    // Wait for search results to load
    await this.page.waitForSelector('[data-ph-at-id="jobs-list"]');
    
    // Get location elements within the search results container
    const searchResultsContainer = this.page.locator('div[data-widget="phw-search-results-v1"]');
    const locationElements = searchResultsContainer.locator('[data-ph-at-id="job-location"] div[role="text"]');
    const locationCount = await locationElements.count();
    
    expect(locationCount).toBeGreaterThan(0);
    
    const locations: string[] = [];
    for (let i = 0; i < locationCount; i++) {
      const locationText = await locationElements.nth(i).textContent();
      if (locationText) {
        const cleanText = locationText.replace('Location :', '').trim();
        if (cleanText) {
          locations.push(cleanText);
        }
      }
    }
    
    const uniqueLocations = [...new Set(locations)];
    expect(uniqueLocations.length).toBeGreaterThan(1);
  }

  async verifyAllResultsAreFromCountry(countryName: string): Promise<void> {
    // Get location elements within the search results container
    const searchResultsContainer = this.page.locator('div[data-widget="phw-search-results-v1"]');
    const locationElements = searchResultsContainer.locator('[data-ph-at-id="job-location"] div[role="text"]');
    const locationCount = await locationElements.count();
    
    expect(locationCount).toBeGreaterThan(0);
    
    // Verify all locations contain the specified country
    for (let i = 0; i < locationCount; i++) {
      const locationText = await locationElements.nth(i).textContent();
      const cleanText = locationText?.replace('Location :', '').trim() || '';
      if (cleanText) {
        expect(cleanText).toContain(countryName);
      }
    }
    
    const jobResultsCount = await this.getSearchResultsCount();
  }

  async getSearchResultsCount(): Promise<number> {
    // Count the job result elements within the search results container
    const searchResultsContainer = this.page.locator('div[data-widget="phw-search-results-v1"]');
    const jobItems = searchResultsContainer.locator('div[data-ph-at-id="jobs-list"]');
    return await jobItems.count();
  }

  async verifyResultsCountChanged(initialCount: number): Promise<void> {
    // Count the job result elements after filtering - same method as initial count
    const searchResultsContainer = this.page.locator('div[data-widget="phw-search-results-v1"]');
    const jobItems = searchResultsContainer.locator('div[data-ph-at-id="jobs-list"]');
    const newCount = await jobItems.count();
    expect(newCount).not.toBe(initialCount);
  }

}
