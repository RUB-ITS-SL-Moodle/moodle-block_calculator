@block @block_calculator @javascript
Feature: Show numbers with the configured separators
  In order to read numbers in my local notation
  As an admin
  I need to set the decimal and thousands separator of the calculator

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

  Scenario: The default settings keep the dot and show no thousands separator
    Given I log in as "user1"
    And I am on "Course 1" course homepage
    When I calculate "1234.5 * 2"
    Then I should see "2469" in the "#data-block-calculator-current-operand" "css_element"
    And I should see "." in the "#data-block-decimal" "css_element"

  Scenario: A comma as decimal separator and a dot as thousands separator
    Given the following config values are set as admin:
      | decimalseparator       | comma | block_calculator |
      | showthousandsseparator | 1     | block_calculator |
      | thousandsseparator     | dot   | block_calculator |
    And I log in as "user1"
    And I am on "Course 1" course homepage
    When I calculate "1234.5 + 1000000"
    Then I should see "1.001.234,5" in the "#data-block-calculator-current-operand" "css_element"
    And I should see "1.234,5+1.000.000=" in the "#data-block-calculator-previous-operand" "css_element"
    And I should see "," in the "#data-block-decimal" "css_element"
