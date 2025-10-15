import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { CareersPage } from '../pages/CareersPage';

// Step definitions for TC001 - Career Search and Filtering test case
let careersPage: CareersPage;
let initialResultsCount: number;

// Initialize page object and navigate to careers page
Given('I navigate to the Just Eat Takeaway careers page', async function (this: CustomWorld) {
  careersPage = new CareersPage(this.page);
  await careersPage.navigateToCareersPage();
  await careersPage.verifyPageTitle();
});

// Search for a specific job title
When('I search for job title {string}', async function (this: CustomWorld, jobTitle: string) {
  await careersPage.searchForJobTitle(jobTitle);
});

// Verify search results contain multiple locations and store initial count
Then('I should see search results from multiple locations', async function (this: CustomWorld) {
  await careersPage.verifySearchResultsContainMultipleLocations();
  initialResultsCount = await careersPage.getSearchResultsCount();
});

// Open the country filter dropdown
When('I open the country filter', async function (this: CustomWorld) {
  await careersPage.openCountryFilter();
});

// Select a country from the filter
When('I select {string} from the country filter', async function (this: CustomWorld, countryName: string) {
  await careersPage.selectCountryFilterTC001(countryName);
});

// Verify filtered results show only the selected country
Then('I should see that the results are filtered to show only Netherlands locations', async function (this: CustomWorld) {
  await careersPage.verifyResultsCountChanged(initialResultsCount);
  await careersPage.verifyAllResultsAreFromCountry('Netherlands');
});
