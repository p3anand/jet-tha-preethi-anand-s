Feature: Just Eat Takeaway Career Search
  As a job seeker
  I want to search for jobs and filter by location
  So that I can find relevant job opportunities

  Scenario: TC001 - Search for Test jobs and filter by Netherlands
    # Navigate to careers page and verify page loads correctly
    Given I navigate to the Just Eat Takeaway careers page
    
    # Search for "Test" jobs and verify multiple locations
    When I search for job title "Test"
    Then I should see search results from multiple locations
    
    # Apply country filter and verify results
    When I open the country filter
    And I select "Netherlands" from the country filter
    Then I should see that the results are filtered to show only Netherlands locations
