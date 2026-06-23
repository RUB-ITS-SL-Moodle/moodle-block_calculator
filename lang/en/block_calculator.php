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
 * @package     block_calculator
 * @category    string
 * @copyright   2024 Leon Berau <leon.berau@ruhr-uni-bochum.de>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['calculator:addinstance'] = 'Add a new Calculator block';
$string['calculator:myaddinstance'] = 'Add a new Calculator block to dashboard';
$string['calculator_actions_title'] = 'Calculator Actions:';
$string['calculator_close'] = 'Close';
$string['calculator_divide_by_zero'] = 'Division by 0 not possible';
$string['calculator_popout'] = 'Popout';
$string['calculator_popout_description'] = "<b><i>Keyboard Input</i></b>
<div class=\"d-inline-block block-calculator-w-100\"><b>Clear everything</b>: <div class=\"float-end\">ESC</div></div>
<div class=\"d-inline-block block-calculator-w-100\"><b>Delete one</b>: <div class=\"float-end\">Back (←)</div></div>
<div class=\"d-inline-block block-calculator-w-100\"><b>Negative</b>: <div class=\"float-end\">N</div></div>
<div class=\"d-inline-block block-calculator-w-100\"><b>Numbers</b>: <div class=\"float-end\">0-9</div></div>
<div class=\"d-inline-block block-calculator-w-100\"><b>Operators</b>: <div class=\"float-end\"><b>+</b> | <b>-</b> | <b>/</b> or <b>÷</b> | <b>*</b></div></div>
<div class=\"d-inline-block block-calculator-w-100\"><b>Parenthesis</b>: <div class=\"float-end\"><b>(</b> or <b>)</b></div></div>
<div class=\"d-inline-block block-calculator-w-100\"><b>Decimals</b>: <div class=\"float-end\"><b>,|.</b></div></div>
<hr>
<b><i>Popout</i></b>
<p>Pop out the calculator by pressing the \"Popout\" button at the top of the calculator.
Then you can drag the Calculator with your mouse by holding the left mouse button, while being on the calculator head.
To drop the calculator back, press the close button on the top of the calculator.</p>";
$string['calculator_popout_description_title'] = 'Instructions:';
$string['calculator_reset_button'] = 'Reset Calculator Position';
$string['copyresult'] = 'Copy result';
$string['decimalseparator'] = 'Decimal separator';
$string['decimalseparator_desc'] = 'Character shown as decimal separator in the display and on the decimal key. The keyboard accepts both "." and ",".';
$string['invalidinput'] = 'Invalid input';
$string['pluginname'] = 'Calculator';
$string['privacy:metadata'] = 'The Calculator block saves no data.';
$string['separator_apostrophe'] = 'Apostrophe (\')';
$string['separator_comma'] = 'Comma (,)';
$string['separator_dot'] = 'Dot (.)';
$string['separator_space'] = 'Space';
$string['showcopybutton'] = 'Show copy button';
$string['showcopybutton_desc'] = 'Show a button next to DEL that copies the current value of the display, e.g. the result, to the clipboard.';
$string['showthousandsseparator'] = 'Show thousands separator';
$string['showthousandsseparator_desc'] = 'Group the digits of numbers in the display by thousands.';
$string['thousandsseparator'] = 'Thousands separator';
$string['thousandsseparator_desc'] = 'Character used to group the digits by thousands. If it equals the decimal separator, no thousands separator is shown.';
