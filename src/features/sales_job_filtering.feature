Feature: Sales Job Filtering with Dropdown Selection
  As a job seeker
  I want to filter Sales jobs by category and country
  So that I can find relevant job opportunities

  @TC002
  Scenario: TC002 - Filter Sales jobs and select Germany
    # Navigate to careers page and verify page loads correctly
    Given I navigate to the Just Eat Takeaway careers page for Sales filtering
    
    # Open category dropdown and select Sales
    When I click on the job search input field to open dropdown
    And I select "Sales" from the dropdown menu
    
    # Verify we're on the Sales jobs page and category is selected
    Then I should be on the Sales jobs page
    And I should verify that "Sales" category is selected
    And I should verify that the job count matches the category count
    
    # Apply country filter and verify results
    When I select "Germany" from the country filter on Sales page
    Then I should verify that the filtered job count matches the "Germany" count
