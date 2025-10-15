Feature: Just Eat Takeaway Career Search
  As a job seeker
  I want to search for jobs and filter by location
  So that I can find relevant job opportunities

  Scenario: TC001 - Search for Test jobs and filter by Netherlands
    Given I navigate to the Just Eat Takeaway careers page
    When I search for job title "Test"
    Then I should see search results from multiple locations
    When I open the country filter
    And I select "Netherlands" from the country filter
    Then I should see that the results are filtered to show only Netherlands locations
