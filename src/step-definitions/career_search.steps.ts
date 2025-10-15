import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { CareersPage } from '../pages/CareersPage';

let careersPage: CareersPage;
let initialResultsCount: number;

Given('I navigate to the Just Eat Takeaway careers page', async function (this: CustomWorld) {
  careersPage = new CareersPage(this.page);
  await careersPage.navigateToCareersPage();
  await careersPage.verifyPageTitle();
});

When('I search for job title {string}', async function (this: CustomWorld, jobTitle: string) {
  await careersPage.searchForJobTitle(jobTitle);
});

Then('I should see search results from multiple locations', async function (this: CustomWorld) {
  await careersPage.verifySearchResultsContainMultipleLocations();
  initialResultsCount = await careersPage.getSearchResultsCount();
});

When('I open the country filter', async function (this: CustomWorld) {
  await careersPage.openCountryFilter();
});

When('I select {string} from the country filter', async function (this: CustomWorld, countryName: string) {
  await careersPage.selectCountryFilter(countryName);
});

Then('I should see that the results are filtered to show only Netherlands locations', async function (this: CustomWorld) {
  await careersPage.verifyResultsCountChanged(initialResultsCount);
  await careersPage.verifyAllResultsAreFromCountry('Netherlands');
});
