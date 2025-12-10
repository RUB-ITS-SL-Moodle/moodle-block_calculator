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

$string['calculator_close'] = 'Schließen';
$string['calculator_divide_by_zero'] = 'Teilen durch 0 nicht möglich';
$string['calculator_popout'] = 'Popout';
$string['calculator_popout_description'] =
    "\r" .
    "<b><i>Tastatureingabe</i></b>" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Alles löschen (AC)</b>:   <div style=\"float: right;\">ESC</div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Einzeln löschen (DEL)</b>:         <div style=\"float: right;\">Back (<--)</div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Negativ</b>:           <div style=\"float: right;\">N</div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Zahlen</b>:            <div style=\"float: right;\">0-9</div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Operatoren</b>:          <div style=\"float: right;\"><b>+</b> | <b>-</b> | <b>/</b> or <b>÷</b> | <b>*</b></div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Klammern</b>:        <div style=\"float: right;\"><b>(</b> or <b>)</b></div></div>\n" .
    "<div style=\"display: inline-block;width: 100%;\"><b>Dezimal</b>:           <div style=\"float: right;\"><b>,</b></div></div><hr>" .
    "<b><i>Den Taschenrechner herauslösen</i></b>\n" .
    "<p>Um den Taschenrechner in einem eigenem Fenster zu öffnen, drücke die \"Popout\" Schaltfläche oben in der Kopfleiste des Taschenrechners.\n\n" .
    "Danach kann man den Taschenrechner bei gedrückter linker Maustaste aus der Kopfzeile heraus bewegen.\n\n" .
    "Um den Taschenrechner wieder zurück in den Block zu bringen, drücke auf \"Schließen\" in der Kopfzeile des Taschenrechners.</p";
$string['calculator_popout_description_title'] = 'Anleitung:';
$string['invalidinput'] = 'Ungültige Eingabe';
$string['pluginname'] = 'Taschenrechner';
$string['privacy:metadata'] = 'Der Simple Calculator Block speichert keine Daten.';
$string['calculator:addinstance'] = 'Füge einen neuen Taschenrechner Block hinzu';
$string['calculator:myaddinstance'] = 'Füge einen neuen Taschenrechner Block zum Dashboard hinzu';
