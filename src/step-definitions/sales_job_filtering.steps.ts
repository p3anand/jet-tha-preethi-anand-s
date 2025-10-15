import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { SalesJobsPage } from '../pages/SalesJobsPage';

// Step definitions for TC002 - Sales Job Filtering test case
let salesJobsPage: SalesJobsPage;

// Initialize page object and navigate to careers page
Given('I navigate to the Just Eat Takeaway careers page for Sales filtering', async function (this: CustomWorld) {
  salesJobsPage = new SalesJobsPage(this.page);
  await salesJobsPage.navigateToCareersPage();
  await salesJobsPage.verifyPageTitle();
});

// Click search input to open category dropdown
When('I click on the job search input field to open dropdown', async function (this: CustomWorld) {
  await salesJobsPage.clickJobSearchInput();
});

// Select a category from the dropdown (e.g., "Sales")
When('I select {string} from the dropdown menu', async function (this: CustomWorld, option: string) {
  await salesJobsPage.selectFromDropdown(option);
});

// Verify navigation to Sales jobs page
Then('I should be on the Sales jobs page', async function (this: CustomWorld) {
  await salesJobsPage.verifyOnSalesJobsPage();
});

// Verify that the specified category is selected
Then('I should verify that {string} category is selected', async function (this: CustomWorld, category: string) {
  await salesJobsPage.verifySalesCategorySelected();
});

// Verify job count matches category count
Then('I should verify that the job count matches the category count', async function (this: CustomWorld) {
  await salesJobsPage.verifyJobCountMatchesCategoryCount();
});

// Select a country from the country filter
When('I select {string} from the country filter on Sales page', async function (this: CustomWorld, countryName: string) {
  await salesJobsPage.selectCountryFilter(countryName);
});

// Verify filtered job count matches country count
Then('I should verify that the filtered job count matches the {string} count', async function (this: CustomWorld, countryName: string) {
  await salesJobsPage.verifyFilteredJobCountMatchesCountryCount(countryName);
});
