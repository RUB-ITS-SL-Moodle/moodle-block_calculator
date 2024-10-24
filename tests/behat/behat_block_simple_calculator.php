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
 * Behat steps definitions for block simple calculator
 *
 * @package    block_simple_calculator
 * @category   test
 * @copyright  2024 Leon Berau
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// NOTE: no MOODLE_INTERNAL test here, this file may be required by behat before including /config.php.

require_once(__DIR__ . '/../../../../lib/behat/behat_base.php');

/**
 * Behat steps definitions for block simple calculator
 *
 * @package    block_simple_calculator
 * @category   test
 * @copyright  2024 Leon Berau
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class behat_block_simple_calculator extends behat_base {


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
