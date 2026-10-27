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
 * Block calculator renderer.
 *
 * @package     block_calculator
 * @copyright   2024 Leon Berau <leon.berau@ruhr-uni-bochum.de>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_calculator\output;

/**
 * renderer
 *
 * @package     block_calculator
 * @copyright   2024 Leon Berau <leon.berau@ruhr-uni-bochum.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class renderer extends \core\output\plugin_renderer_base {
    /**
     * render_calculator
     *
     * @return string
     */
    public function render_calculator() {
        $separators = self::get_separators();
        $this->page->requires->js_call_amd('block_calculator/calculator_base', 'init', [$separators]);
        return parent::render_from_template('block_calculator/calculator', $separators + [
            'showcopybutton' => (bool)get_config('block_calculator', 'showcopybutton'),
        ]);
    }

    /**
     * Get the decimal and thousands separators from the site settings.
     *
     * @return array With keys decimalseparator and thousandsseparator ('' if not shown).
     */
    public static function get_separators(): array {
        $chars = [
            'dot' => '.',
            'comma' => ',',
            // Narrow no-break space, so that a number never wraps at the separator.
            'space' => "\u{202F}",
            'apostrophe' => "'",
        ];
        $config = get_config('block_calculator');
        $decimal = ($config->decimalseparator ?? '') === 'comma' ? ',' : '.';
        $thousands = '';
        if (!empty($config->showthousandsseparator)) {
            $thousands = $chars[$config->thousandsseparator ?? ''] ?? ',';
            if ($thousands === $decimal) {
                // The same character for both would make the display ambiguous.
                $thousands = '';
            }
        }
        return ['decimalseparator' => $decimal, 'thousandsseparator' => $thousands];
    }
}
