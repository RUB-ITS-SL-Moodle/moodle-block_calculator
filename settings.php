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
 * Admin settings for the calculator block.
 *
 * @package     block_calculator
 * @copyright   2026 ISB Bayern
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

if ($ADMIN->fulltree) {
    $settings->add(new admin_setting_configcheckbox(
        'block_calculator/showcopybutton',
        get_string('showcopybutton', 'block_calculator'),
        get_string('showcopybutton_desc', 'block_calculator'),
        0
    ));

    $settings->add(new admin_setting_configselect(
        'block_calculator/decimalseparator',
        get_string('decimalseparator', 'block_calculator'),
        get_string('decimalseparator_desc', 'block_calculator'),
        'dot',
        [
            'dot' => get_string('separator_dot', 'block_calculator'),
            'comma' => get_string('separator_comma', 'block_calculator'),
        ]
    ));

    $settings->add(new admin_setting_configcheckbox(
        'block_calculator/showthousandsseparator',
        get_string('showthousandsseparator', 'block_calculator'),
        get_string('showthousandsseparator_desc', 'block_calculator'),
        0
    ));

    $settings->add(new admin_setting_configselect(
        'block_calculator/thousandsseparator',
        get_string('thousandsseparator', 'block_calculator'),
        get_string('thousandsseparator_desc', 'block_calculator'),
        'comma',
        [
            'dot' => get_string('separator_dot', 'block_calculator'),
            'comma' => get_string('separator_comma', 'block_calculator'),
            'space' => get_string('separator_space', 'block_calculator'),
            'apostrophe' => get_string('separator_apostrophe', 'block_calculator'),
        ]
    ));
    $settings->hide_if('block_calculator/thousandsseparator', 'block_calculator/showthousandsseparator');
}
