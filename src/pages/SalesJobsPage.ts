import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for Sales Jobs functionality on Just Eat Takeaway careers site
 * Handles dropdown selection, category filtering, and country filtering for Sales jobs
 */
export class SalesJobsPage {
  readonly page: Page;
  
  // Centralized timeout configuration for consistent waits
  private readonly TIMEOUTS = {
    SHORT: 3000,   // Quick operations
    MEDIUM: 8000,  // Standard operations
    LONG: 12000    // Complex operations
  };

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the main careers page
  async navigateToCareersPage(): Promise<void> {
    await this.page.goto('https://careers.justeattakeaway.com/global/en/home');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Verify we're on the correct careers page
  async verifyPageTitle(): Promise<void> {
    const title = await this.page.title();
    expect(title).toContain('Just Eat Takeaway Careers');
  }

  // Click the job search input to open the category dropdown
  async clickJobSearchInput(): Promise<void> {
    await this.page.click('input[placeholder="Search for job title"]');
    await this.takeScreenshot('TC002_step_02');
  }

  // Helper method to capture screenshots for TC002
  private async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/TC002/${filename}.png`, 
      fullPage: true 
    });
  }

  // Select a category option from the dropdown (Sales in our case)
  async selectFromDropdown(option: string): Promise<void> {
    const selector = `a[data-ph-at-data-text="${option}"][data-ph-at-id="category-link"]`;
    await this.page.waitForSelector(selector, { timeout: this.TIMEOUTS.MEDIUM });
    await this.page.click(selector);
    
    // Wait for navigation to the category-specific jobs page
    const expectedUrl = `**/c/${option.toLowerCase().replace(/\s+/g, '-')}-jobs`;
    await this.page.waitForURL(expectedUrl, { timeout: this.TIMEOUTS.MEDIUM });
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Verify we're on the Sales jobs page
  async verifyOnSalesJobsPage(): Promise<void> {
    const currentUrl = this.page.url();
    expect(currentUrl).toContain('/c/sales-jobs');
  }

  // Verify that the Sales category checkbox is selected
  async verifySalesCategorySelected(): Promise<void> {
    const salesCheckbox = this.page.locator('input[data-ph-at-text="Sales"][data-ph-at-facetkey="facet-category"]');
    await expect(salesCheckbox).toBeChecked();
  }

  // Verify that the displayed job count matches the category count
  async verifyJobCountMatchesCategoryCount(): Promise<void> {
    const categoryCount = await this.getCategoryJobCount('Sales');
    const resultCount = await this.getSearchResultsCount();
    expect(resultCount).toBe(categoryCount);
  }

  // Extract job count from category checkbox aria-label
  private async getCategoryJobCount(category: string): Promise<number> {
    const categoryCheckbox = this.page.locator(`input[data-ph-at-text="${category}"][data-ph-at-facetkey="facet-category"]`);
    const ariaLabel = await categoryCheckbox.getAttribute('aria-label');
    return parseInt(ariaLabel?.match(/(\d+)/)?.[1] || '0');
  }

  // Extract job count from search results display
  private async getSearchResultsCount(): Promise<number> {
    const resultCountElement = this.page.locator('[data-ph-at-id="search-page-top-job-count"] .result-count');
    const resultText = await resultCountElement.textContent();
    return parseInt(resultText || '0');
  }

  // Select a country from the country filter dropdown
  async selectCountryFilter(countryName: string): Promise<void> {
    await this.openCountryFilter();
    await this.selectCountryFromFilter(countryName);
    await this.page.waitForTimeout(1000); // Wait for filter to be applied
  }

  // Open the country filter dropdown
  private async openCountryFilter(): Promise<void> {
    const countryButton = this.page.locator('button[data-ph-at-id="facet-heading-link"][data-ph-at-text="Country"]');
    await countryButton.waitFor({ timeout: this.TIMEOUTS.MEDIUM });
    await countryButton.click();
    await this.page.waitForSelector('ul[data-ph-at-id="facet-results-list"]', { timeout: this.TIMEOUTS.SHORT });
  }

  // Select a specific country from the opened filter dropdown
  private async selectCountryFromFilter(countryName: string): Promise<void> {
    const countryListItem = this.page.locator(`li[data-ph-at-id="facet-results-item"]:has(input[data-ph-at-text="${countryName}"])`);
    const countryCheckbox = countryListItem.locator('span.checkbox');
    await countryCheckbox.waitFor({ timeout: this.TIMEOUTS.SHORT });
    await countryCheckbox.click();
  }

  // Verify that filtered job count matches the country filter count
  async verifyFilteredJobCountMatchesCountryCount(countryName: string): Promise<void> {
    const countryCount = await this.getCountryJobCount(countryName);
    const resultCount = await this.getSearchResultsCount();
    expect(resultCount).toBe(countryCount);
  }

  // Extract job count from country checkbox aria-label
  private async getCountryJobCount(countryName: string): Promise<number> {
    const countryCheckbox = this.page.locator(`input[data-ph-at-text="${countryName}"][data-ph-at-facetkey="facet-country"]`);
    const ariaLabel = await countryCheckbox.getAttribute('aria-label');
    return parseInt(ariaLabel?.match(/(\d+)/)?.[1] || '0');
  }
}
