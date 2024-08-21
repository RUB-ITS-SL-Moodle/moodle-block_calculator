@block_simple_calculator @javascript
Feature: Show the results of the calculator
    In order to see the results of using the Calculator
    As an User
    I need to give the calculator input

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
            | blockname         | contextlevel | reference | pagetypepattern | defaultregion |
            | smiple_calculator | Course       | C1        | course-view-*   | side-pre      |
        # Add Calculator Block to Course1
        And I log in as "admin"
        And I am on "Course 1" course homepage with editing mode on
        And I add the "Calculator" block
        And I log out

    Scenario Outline: Put into the Calculator numbers and view the Output
        Given I log in as "user1"
        When I am on "Course 1" course homepage
        And I should see "Calculator"
        And I calculate "<calculation>"
        Then I should see "<results>"

        Examples:
            | calculation      | results |
            | 10 / 2           | 5       |
            | 12 + 56.2        | 68.2    |
            | 12.2456 - 18.136 | -5.8904 |
            | 36.3 * 2.5       | 90.75   |
            | -24.12 * 4       | -96.48  |
            | -15 + 3          | 12      |
            | 12 + -3          | 9       |
            | -2 - -4          | 2       |