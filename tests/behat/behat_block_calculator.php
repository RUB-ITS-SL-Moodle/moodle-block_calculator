<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Behat steps definitions for block  calculator
 *
 * @package    block_calculator
 * @category   test
 * @copyright  2024 Leon Berau
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// NOTE: no MOODLE_INTERNAL test here, this file may be required by behat before including /config.php.

require_once(__DIR__ . '/../../../../lib/behat/behat_base.php');

/**
 * Behat steps definitions for block  calculator
 *
 * @package    block_calculator
 * @category   test
 * @copyright  2024 Leon Berau
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class behat_block_calculator extends behat_base {
    /**
     * Calculate based off the calculation String by pressing the buttons.
     *
     * @Then /^I calculate "(?P<numbers_string>(?:[^"]|\\")*)"$/
     * @param string $numbers
     */
    public function i_calculate($numbers) {
        // Remove whitespace.
        $nums = str_replace(' ', '', $numbers);

        // Loop through all Characters.
        for ($char = 0; $char < strlen($nums); $char++) {
            // Press the identic Button.

            $buttonchar = preg_match("/\/|\+|\-|n|\*|\.|\(|\)/", $nums[$char]) ? ($this->translatekey($nums[$char])) : $nums[$char];

            $this->execute(
                'behat_general::i_click_on',
                ["data-block-$buttonchar", "button"]
            );
        }

        // Execute the calculation.
        $this->execute('behat_general::i_click_on', ['data-block-equals', 'button']);
    }

    /**
     * Check that the calculator is detached from the block drawer.
     *
     * @Then /^the calculator should be popped out$/
     */
    public function the_calculator_should_be_popped_out(): void {
        $ispoppedout = $this->getSession()->evaluateScript(
            "return (function() {
            const calculator = document.querySelector('#data-block-calculator');
            return calculator !== null &&
                calculator.parentElement === document.body &&
                calculator.classList.contains('block-calculator-draggable') &&
                getComputedStyle(calculator).position === 'fixed';"
                . "})();"
        );

        if (!$ispoppedout) {
            throw new \Behat\Mink\Exception\ExpectationException(
                'The calculator is not popped out of the block drawer.',
                $this->getSession()
            );
        }
    }

    /**
     * Move the popped-out calculator away from the center before testing reset.
     *
     * @When /^I move the popped-out calculator away from the center$/
     */
    public function i_move_the_popped_out_calculator_away_from_the_center(): void {
        $this->getSession()->executeScript(
            "const calculator = document.querySelector('#data-block-calculator');
            if (!calculator || calculator.parentElement !== document.body) {
                throw new Error('The calculator must be popped out before moving it.');
            }
            calculator.style.left = '16px';
            calculator.style.top = '16px';"
        );
    }

    /**
     * Check that the calculator is centered within the viewport.
     *
     * @Then /^the calculator should be centered in the viewport$/
     */
    public function the_calculator_should_be_centered_in_the_viewport(): void {
        $iscentered = $this->getSession()->evaluateScript(
            "return (function() {
            const calculator = document.querySelector('#data-block-calculator');
            if (!calculator) {
                return false;
            }
            const rect = calculator.getBoundingClientRect();
            return Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2) < 2 &&
                Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2) < 2;"
                . "})();"
        );

        if (!$iscentered) {
            throw new \Behat\Mink\Exception\ExpectationException(
                'The calculator is not centered in the viewport.',
                $this->getSession()
            );
        }
    }


    /**
     * translatekey
     *
     * @param  string $key
     * @return string
     */
    public function translatekey(string $key) {
        switch ($key) {
            case ")":
                return "parenthesis-close";
            case "(":
                return "parenthesis-open";
            case ".":
                return "decimal";
            case "/":
                return "divide";
            case "+":
                return "plus";
            case "-":
                return "minus";
            case "n":
                return "negative";
            case "*":
                return "multiply";
        }
        return $key;
    }
}
