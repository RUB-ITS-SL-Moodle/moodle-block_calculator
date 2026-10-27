@block @block_calculator @javascript
Feature: Copy the result of the calculator
  In order to reuse a result in other fields
  As an admin
  I need to show a button that copies the result to the clipboard

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

  Scenario: The copy button is hidden by default
    Given I log in as "user1"
    When I am on "Course 1" course homepage
    Then "Copy result" "button" should not exist

  Scenario: The copy button is shown next to DEL when enabled
    Given the following config values are set as admin:
      | showcopybutton | 1 | block_calculator |
    And I log in as "user1"
    When I am on "Course 1" course homepage
    Then "Copy result" "button" should exist
    And "#data-block-DEL + #data-block-copy" "css_element" should exist
