@block @block_calculator @javascript
Feature: Pop out and reset the calculator position
  In order to use the calculator outside the block drawer
  As a user
  I need to pop it out and reset its position when needed

  Background:
    Given the following "users" exist:
      | username |
      | user1    |
    And the following "courses" exist:
      | fullname | shortname |
      | Course 1 | C1        |
    And the following "course enrolments" exist:
      | user  | course | role    |
      | user1 | C1     | student |
    And the following "blocks" exist:
      | blockname  | contextlevel | reference | pagetypepattern | defaultregion |
      | calculator | Course       | C1        | course-view-*   | side-pre      |

  Scenario: Pop out the calculator and reset its position
    Given I log in as "user1"
    And I am on "Course 1" course homepage
    When I click on ".button-block-calculator-popout" "css_element"
    Then the calculator should be popped out
    When I move the popped-out calculator away from the center
    And I click on "#block-calculator-reset-button" "css_element"
    Then the calculator should be centered in the viewport
