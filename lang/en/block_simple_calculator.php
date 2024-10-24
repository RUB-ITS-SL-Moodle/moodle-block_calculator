<?php
// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Plugin strings are defined here.
 *
 * @package     block_simple_calculator
 * @category    string
 * @copyright   2024 Leon Berau <leon.berau@ruhr-uni-bochum.de>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['calculator_close'] = 'Close';
$string['calculator_divide_by_zero'] = 'Cant divide by Zero.';
$string['calculator_popout'] = 'Popout';
$string['calculator_popout_description'] =
    "\r".
    "<b><i>Keyboard Input</i></b>" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Clear everything</b>:   <div style=\"float: right;\">ESC</div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Delete one</b>:         <div style=\"float: right;\">Back (<--)</div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Negative</b>:           <div style=\"float: right;\">N</div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Numbers</b>:            <div style=\"float: right;\">0-9</div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Operators</b>:          <div style=\"float: right;\"><b>+</b> | <b>-</b> | <b>/</b> or <b>÷</b> | <b>*</b></div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Parenthesis</b>:        <div style=\"float: right;\"><b>(</b> or <b>)</b></div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Decimals</b>:           <div style=\"float: right;\"><b>,</b></div></div><hr>" .
    "<b><i>Popout</i></b>\n" .
    "<p>Pop out the Calculator by pressing the \"Popout\" Button at the Top of the Calculator.\n\n" .
    "After pressing the Button, you can drag the Calculator with your Mouse by holding the left Mouse Button, while being on the Calculator Head.\n\n" .
    "To drop the Calculator back, you should press the close Button on the top of the Calculator.</p";
$string['calculator_popout_description_title'] = 'Instructions:';
$string['invalidinput'] = 'Invalid Input';
$string['pluginname'] = 'Calculator';
$string['privacy:metadata'] = 'The Simple Calculator block saves no data.';
$string['simple_calculator:addinstance'] = 'Add a new Calculator block';
$string['simple_calculator:myaddinstance'] = 'Add a new Calculator block to dashboard';
