@block @block_calculator @javascript
Feature: Keyboard accessible Instructions accordion
  In order to read how to use the calculator without a mouse
  As a keyboard or screen reader user
  I need to focus, open and close the Instructions accordion using the keyboard

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
    And I log in as "user1"
    And I am on "Course 1" course homepage

  Scenario: The Instructions accordion is a focusable button that starts collapsed
    Then "a#block-calculator-accordion-collapse[role=button][tabindex=0]" "css_element" should exist
    And the "aria-expanded" attribute of "#block-calculator-accordion-collapse" "css_element" should contain "false"
    And "#block-calculator-accordion-body" "css_element" should not be visible

  Scenario: The Instructions accordion can be reached with the Tab key
    When I focus on the calculator element "#data-block-equals"
    And I press the tab key
    Then the focused element is "#block-calculator-accordion-collapse" "css_element"

  Scenario: The Instructions accordion can be opened and closed with the Enter key
    Given I focus on the calculator element "#block-calculator-accordion-collapse"
    When I press the enter key
    Then "#block-calculator-accordion-body" "css_element" should be visible
    And the "aria-expanded" attribute of "#block-calculator-accordion-collapse" "css_element" should contain "true"
    And I press the enter key
    And "#block-calculator-accordion-body" "css_element" should not be visible
    And the "aria-expanded" attribute of "#block-calculator-accordion-collapse" "css_element" should contain "false"

  Scenario: The Instructions accordion can be opened and closed with the Space key
    Given I focus on the calculator element "#block-calculator-accordion-collapse"
    When I press the space key
    Then "#block-calculator-accordion-body" "css_element" should be visible
    And the "aria-expanded" attribute of "#block-calculator-accordion-collapse" "css_element" should contain "true"
    And I press the space key
    And "#block-calculator-accordion-body" "css_element" should not be visible
    And the "aria-expanded" attribute of "#block-calculator-accordion-collapse" "css_element" should contain "false"

  Scenario: The Instructions accordion opens with a single mouse click
    When I click on "#block-calculator-accordion-collapse" "css_element"
    Then "#block-calculator-accordion-body" "css_element" should be visible
    And the "aria-expanded" attribute of "#block-calculator-accordion-collapse" "css_element" should contain "true"
