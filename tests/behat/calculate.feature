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
            | simple_calculator | Course       | C1        | course-view-*   | side-pre      |

    Scenario Outline: Put into the Calculator numbers and view the Output
        Given I log in as "user1"
        When I am on "Course 1" course homepage
        And I should see "Calculator"
        And I calculate "<calculation>"
        Then I should see "<results>"

        Examples:
            | calculation                         | results                           |
            | 1 / (2n-2n)                         | Invalid input                     |
            | 10 + 5 +( 1 / (2n-2n)) * 2          | Invalid input                     |
            | 10 / 2                              | 5                                 |
            | 12 + 56.2                           | 68.2                              |
            | 12.2456 - 18.136                    | -5.8904                           |
            | 36.3 * 2.5                          | 90.75                             |
            | 24.12n * 4                          | -96.48                            |
            | 15n + 3                             | 12                                |
            | 12 + 3n                             | 9                                 |
            | 2n - 4n                             | 2                                 |
            | (14.5n + 7) * (10 / 1.5)            | -50                               |
            | ((230.89 * 2n) / (21n - 543n)) + 10 | 9.1153639846743295019             |
            | 1 / 999999999                       | 1.000000001000000001e-9           |
            | 25 / 0                              | Division by 0 not possible              |
            | 0 / 25                              | 0                                 |
            | (25) * (                            | 0                                 |
            | (34 + 54 * 75 + 24                  | 4108                              |
            | 5 + 8 * (                           | 5                                 |
            | 5 + 8 (                             | 5                                 |
            | (0 -                                | 0                                 |
            | 0n - 0                              | 0                                 |
            | (56 + )                             | 112                               |
            | (56 + 23)                           | 79                                |


    Scenario Outline: Put into the Calculator numbers and after the Calculation calculate furthermore
        Given I log in as "user1"
        When I am on "Course 1" course homepage
        And I should see "Calculator"
        And I calculate "<firstCalculation>"
        And I should see "<firstResults>"
        And I calculate "<secondCalculation>"
        Then I should see "<secondResults>"
        

        Examples:
            | firstCalculation | firstResults | secondCalculation | secondResults |
            | 10 / 2           | 5            | *(23 + 20n)        | 15           |
            | 10 / 2           | 5            | *(23 + 20n         | 15           |
