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

/* eslint-disable block-scoped-var */
/* eslint-disable camelcase */
/* eslint-disable capitalized-comments */
/* eslint-disable complexity */
/* eslint-disable jsdoc/require-param */
/* eslint-disable max-depth */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */

/**
 * Adds the base function of a Calculator.
 *
 * @module      block_calculator/calculator_base
 * @copyright   2024 Leon Berau <leon.berau@ruhr-uni-bochum.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Define the ShuntingYardConverter and RPNEvaluator for the Calculator to use.
 * @see https://en.wikipedia.org/wiki/Shunting_yard_algorithm
 * @see https://en.wikipedia.org/wiki/Reverse_Polish_notation
 *
 * @param core/str cstr
 * @param ShuntingYardConverter ShuntingYardConverter
 * @param RPNEvaluator RPNEvaluator
 */
define([
  'core/str',
  'block_calculator/shunting_yard_converter',
  'block_calculator/rpn_evaluator'
], function(cstr, ShuntingYardConverter, RPNEvaluator) {

  /**
   * Helper function to get element by selector.
   */
  const $ = selector => {
    const elements = document.querySelectorAll(selector);
    return elements.length === 1 ? elements[0] : elements;
  };

  /**
   * Selectors
   * Get all needed ids, and Classnames to select it.
   */
  const SELECTORS = {
    CALCULATOR_DRAG_HEADER: '#data-block-drag-header',
    CALCULATOR: '#data-block-calculator',
    CURRENTOPERAND: '#data-block-calculator-current-operand',
    PREVIOUSOPERAND: '#data-block-calculator-previous-operand',
    NUMBERS: '.data-block-calculator-number',
    OPERATIONS: '.data-block-calculator-operation',
    EQUALS: '.data-block-calculator-equals',
    DELETE: '.data-block-calculator-delete',
    AC: '.data-block-calculator-all-clear',
    OPENPARENTHESISCOUNT: '#data-block-parenthesis-open-count',
    CLOSEPARENTHESISCOUNT: '#data-block-parenthesis-close-count',
    POPOUT: '.button-block-calculator-popout',
    POPOUT_TEXT: '#button-block-calculator-popout-text',
    POPOUT_ICON: '#button-block-calculator-popout-icon',
    COLLAPSE_BUTTON: '#block-calculator-accordion-collapse',
    COLLAPSE_BODY: '#block-calculator-accordion-body'
  };

  /**
   * CSS
   * All dynamic CSS Classes.
   */
  const CSS = {
    DRAGGABLE_CSS_ON: {
      position: 'fixed',
      width: '350px',
      'z-index': 1031,
      visibility: 'visible'
    },
    DRAGGABLE_CSS_OFF: {position: '', width: '', 'z-index': '', visibility: ''},
    DRAGGABLE_CLASS: '',
    POPOUT_CLASS: 'fa-arrow-up-right-from-square',
    POPOUT_CLOSE_CLASS: 'fa-circle-xmark',
    COLLAPSE_ICON_HIDDEN: 'fa-plus',
    COLLAPSE_ICON_SHOWN: 'fa-minus',
  };

  /**
   * Key_Map
   * All keys which the User can use on the Calculator.
   */
  const KEY_MAP = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    '.',
    ',',
    '+',
    '-',
    '*',
    '/',
    '(',
    ')',
    'Enter',
    'Backspace',
    'Escape',
    'n'
  ];
  /**
   * Key_Name_Map
   * Map the Keys to the matching Div id names.
   */
  const KEY_NAME_MAP = {
    "/": "divide",
    "Enter": "equals",
    "Backspace": "DEL",
    "Escape": "AC",
    ",": "decimal",
    ".": "decimal",
    "+": "plus",
    "-": "minus",
    "*": "multiply",
    "(": "parenthesis-open",
    ")": "parenthesis-close",
    "n": "negative"
  };

  /**
   * Operator Regex
   * Regex for matching all Operators.
   */
  const OPERATOR_REGEX = /\+|-|\*|÷/;

  /**
   * Draggable
   * Decides if the Calculator is draggable at the moment.
   */
  var draggable = false;

  /**
   * Position
   * The current position of the Calculator during the Dragging.
   */
  var position = {clientX: 0, clientY: 0, X: 0, Y: 0, offset: 0};

  /**
   * Memory
   * The "Brain" for the Calculator, it operates like a Cache during the Calculation.
   */
  var memory = {
    currentOperand: '',
    previousOperand: '',
    temporayOperand: '',
    operation: null,
    parenthesis: [],
  };

  var base_calculator = {
    /**
     * init
     * Initialize the Calculator
     */
    init: function() {
      // Register the plugin Javascript Events.
      this.registerEvents();
    },

    /**
     * registerEvents
     * Register and listen to all Events.
     */
    registerEvents: function() {
      // Button Events
      this.popoutButton();
      this.numbersButton();
      this.operationsButton();
      this.clearAllButton();
      this.deleteButton();
      this.equalsButton();
      this.collapseButton();

      // Key Events
      this.keyInput();

      // Function Events
      this.drag();

    },

    /**
     * collapseButton
     * Toggles an Accordion Collapse.
     *
     */
    collapseButton: function() {
      $(SELECTORS.COLLAPSE_BUTTON)?.addEventListener("click", (e) => {

        var body = $(SELECTORS.COLLAPSE_BODY);
        if (body) {
          body.style.display = body.style.display === "none" ? "block" : "none";

          if (body.style.display === "block") {
            $(SELECTORS.COLLAPSE_BUTTON)?.classList.remove(CSS.COLLAPSE_ICON_HIDDEN);
            $(SELECTORS.COLLAPSE_BUTTON)?.classList.add(CSS.COLLAPSE_ICON_SHOWN);
          } else {
            $(SELECTORS.COLLAPSE_BUTTON)?.classList.add(CSS.COLLAPSE_ICON_HIDDEN);
            $(SELECTORS.COLLAPSE_BUTTON)?.classList.remove(CSS.COLLAPSE_ICON_SHOWN);
          }
        }
      });
    },

    /**
     * numbersButton
     * Numbers button action.
     *
     */
    numbersButton: function() {

      $(SELECTORS.NUMBERS).forEach((n) => {
        n.addEventListener('click', function(e) {
          e.target.blur();
          var number = n.getAttribute('data-char');

          if (number === '.' && memory.temporayOperand === '' && memory.currentOperand.includes('.')) {
            number = '';
          }

          // If the temporaryOperand is not empty set the current Operand to the new Number.
          if (memory.temporayOperand !== '') {

            // If there was a Calculation before reset the previous Operand.
            if (memory.previousOperand.includes('=')) {

              memory.previousOperand = '';
            }

            if (number === ')' && memory.parenthesis.length !== 0 && base_calculator.hasNumbers(memory.temporayOperand)) {

              memory.previousOperand = memory.previousOperand.toString() +
                memory.operation.toString() + memory.temporayOperand.toString() + number.toString();

              memory.currentOperand = "";
              memory.operation = null;
              memory.parenthesis.pop();
            } else {

              // Verify if the currentOperand already has a point.
              if (number === '.') {
                if (!memory.currentOperand.includes('.') && memory.temporayOperand === '') {
                  memory.currentOperand = memory.currentOperand.toString() + number.toString();
                } else {
                  memory.currentOperand = '0' + number.toString();
                }
              } else {
                // Set the new current Operand.
                memory.currentOperand = number.toString();
              }

            }

            if (number === '(') {

              // Push the parenthesis.
              memory.parenthesis.push(number);

            }

            // Empty the temporary Operand.
            memory.temporayOperand = '';
          } else {
            // Verify if the currentOperand already has a point.
            if (number === '.' && !memory.currentOperand.includes('.')) {

              if (memory.currentOperand === '') {

                memory.currentOperand = '0' + number.toString();
              } else if (memory.currentOperand !== '' && memory.currentOperand === '(') {

                memory.currentOperand = memory.currentOperand.toString() + '0' + number.toString();
              } else if (memory.currentOperand !== '' && base_calculator.hasNumbers(memory.currentOperand)) {

                memory.currentOperand = memory.currentOperand.toString() + number.toString();
              }

            } else if (memory.currentOperand != "" && number === '(' &&
              !isNaN(memory.currentOperand.charAt(memory.currentOperand.length - 1))) {

              // Check if the previous Operand is Empty.
              if (memory.previousOperand === "" && memory.operation === null) {
                // Add a Multiply between the number and the Parenthesis.
                memory.previousOperand = memory.currentOperand.toString() + "*" + number.toString();
              } else {
                // Add a Multiply between the number and the Parenthesis and the previous String from before.
                memory.previousOperand = memory.previousOperand.toString() + memory.operation.toString() +
                  memory.currentOperand.toString() + "*" + number.toString();
              }

              // Set the new Number as the currentOperand.
              memory.currentOperand = "";
              memory.operation = null;

              // Push the parenthesis.
              memory.parenthesis.push(number);

              // Update the Calculator
              base_calculator.update();

            } else if (memory.previousOperand != "" && !isNaN(number) &&
              memory.operation === null &&
              memory.previousOperand.charAt(memory.previousOperand.length - 1) === ')') {

              // Set the current Operation to multiply.
              memory.operation = '*';
              // Set the new currentOperand to the Number.
              memory.currentOperand = number.toString();

              // Update the Calculator
              base_calculator.update();

            } else if (memory.previousOperand != "" && number === '(' &&
              memory.operation === null &&
              memory.previousOperand.charAt(memory.previousOperand.length - 1) === ')') {

              // Set the new currentOperand to the Number.
              memory.currentOperand = "";

              memory.previousOperand = memory.previousOperand.toString() + "*(";

              // Push the parenthesis.
              memory.parenthesis.push(number);

              // Update the Calculator
              base_calculator.update();

            } else if (number === '(') {

              // Push the parenthesis.
              memory.parenthesis.push(number);

              if (memory.operation !== null) {
                // Add the current number to the previous Operand.
                memory.previousOperand = memory.previousOperand.toString() + memory.operation.toString() +
                  number.toString();
                memory.operation = null;
              } else {
                // Add the current number to the previous Operand.
                memory.previousOperand = memory.previousOperand.toString() + number.toString();
              }
            } else if (number === ')') {

              if (memory.parenthesis.length !== 0) {

                // Pop one parenthesis.
                memory.parenthesis.pop();

                // Valdiate if the current Operand is Empty.
                if (memory.currentOperand == "") {

                  // Add the current number to the previous Operand.
                  memory.previousOperand = memory.previousOperand.toString() + number.toString();
                } else {

                  if (memory.operation !== null) {
                    // Otherwise add the current operand to the previous with the current number.
                    memory.previousOperand = memory.previousOperand.toString() +
                      memory.operation.toString() + memory.currentOperand.toString() + number.toString();
                  } else {
                    // Otherwise add the current operand to the previous with the current number.
                    memory.previousOperand = memory.previousOperand.toString() +
                      memory.currentOperand.toString() + number.toString();
                  }

                  // Set the current Operand as empty.
                  memory.currentOperand = "";
                  memory.operation = null;
                }
              }
            } else if (memory.currentOperand.charAt(0) === '0' &&
              memory.currentOperand.charAt(1) === "" && number !== '.') {

              // Replace the Zero through the new Number.
              memory.currentOperand = number.toString();
            } else {
              // Append the new Number to the currentOperand.
              memory.currentOperand = memory.currentOperand.toString() + number.toString();
            }

          }

          // Update the Calculator
          base_calculator.update();
          $(SELECTORS.CALCULATOR)?.focus();
        });
      });
    },

    /**
     * operationsButton
     * Operations button action.
     *
     */
    operationsButton: function() {
      $(SELECTORS.OPERATIONS).forEach((op) => {
        op.addEventListener('click', function(e) {
          e.target.blur();
          var operation = op.getAttribute('data-char');

          if (memory.currentOperand !== '' && base_calculator.hasNumbers(memory.currentOperand) &&
            operation === '+/-') {
            // If Operator is equals to +/- and the current Operand is empty and has Numbers in it then negate.
            if (!memory.currentOperand.includes('-')) {

              // Has no negative Number, declare a temporary Operand string.
              var tempOperand = '';

              // Loop through all Chars.
              for (var c = 0; c < memory.currentOperand.length; c++) {

                // Check the Char is not a Parenthesis
                if (!memory.currentOperand[c].match(/\(|\)/)) {

                  // It is not a Parenthesis and if it dont have a negative Number already.
                  if (!tempOperand.includes('-')) {

                    // Add Negative to the temporary Operand.
                    tempOperand += '-';
                  }

                  // Add the Numbers to the temporary Operand.
                  tempOperand += memory.currentOperand[c];
                } else {

                  // Add the Parenthesis to the temporary Operand.
                  tempOperand += memory.currentOperand[c];
                }
              }

              // Set the currentOperand to the new created temporary Operand.
              memory.currentOperand = tempOperand;

            } else {
              memory.currentOperand = memory.currentOperand.replace('-', '');
            }
          } else if (memory.currentOperand !== '' && memory.previousOperand !== '' && memory.operation !== null &&
            base_calculator.hasNumbers(memory.currentOperand)) {

            // If the previous and current are not empty and a operation gets pressed add the current to the previous.
            memory.previousOperand = memory.previousOperand.toString() + memory.operation.toString() +
              memory.currentOperand.toString();

            if (memory.currentOperand.includes('(')) {
              memory.currentOperand = memory.currentOperand.slice(1);
            } else if (memory.currentOperand.includes(')')) {
              memory.currentOperand = memory.currentOperand.slice(0, -1);
            }

            // Set the temporary Operand to the current and the new Operation.
            memory.temporayOperand = memory.currentOperand;
            memory.operation = operation;

          } else if (memory.previousOperand !== '' && memory.currentOperand !== '' && memory.operation === null &&
            base_calculator.hasNumbers(memory.currentOperand) && memory.previousOperand.includes('=')) {

            // If there was a Calculation before set the previous Operand to the current Operand.
            memory.previousOperand = memory.currentOperand;

            memory.currentOperand = '';
            memory.operation = operation;

          } else if (memory.currentOperand !== '' && memory.previousOperand === '' &&
            base_calculator.hasNumbers(memory.currentOperand)) {

            // If the current Operand is not empty and previous Operand is empty set temporaryOperand.
            memory.previousOperand = memory.currentOperand;
            if (memory.currentOperand.includes('(')) {
              memory.currentOperand = memory.currentOperand.slice(1);
            } else if (memory.currentOperand.includes(')')) {
              memory.currentOperand = memory.currentOperand.slice(0, -1);
            }

            memory.temporayOperand = memory.currentOperand;
            memory.operation = operation;

          } else if (memory.currentOperand === '' &&
            memory.previousOperand !== '' && memory.operation === null) {

            // Set the new Operation.
            memory.operation = operation;

          } else if (memory.currentOperand !== '' &&
            memory.previousOperand !== '' && memory.operation === null) {

            // Add to the previous string the current Operand plus the operation.
            memory.previousOperand = memory.previousOperand.toString() + memory.currentOperand.toString();

            if (memory.currentOperand.includes('(')) {
              memory.currentOperand = memory.currentOperand.slice(1);
            } else if (memory.currentOperand.includes(')')) {
              memory.currentOperand = memory.currentOperand.slice(0, -1);
            }

            memory.temporayOperand = memory.currentOperand;

            // Set the Operation.
            memory.operation = operation;
          }

          if ((memory.currentOperand === '(' || memory.previousOperand === '(')) {

            memory.operation = null;
          }

          // Update the base_calculator.
          base_calculator.update();
          $(SELECTORS.CALCULATOR).focus();
        });
      });
    },

    /**
     * equalsButton
     * Starts to calculate.
     *
     */
    equalsButton: function() {
      $(SELECTORS.EQUALS).addEventListener('click', function(e) {
        e.target.blur();
        base_calculator.calculate();
        $(SELECTORS.CALCULATOR).focus();
      });
    },

    /**
     * deleteButton
     * Remove one character from operand.
     *
     */
    deleteButton: function() {
      $(SELECTORS.DELETE).addEventListener('click', function(e) {
        e.target.blur();

        if (memory.currentOperand == '') {

          if (memory.previousOperand !== '') {

            if (memory.operation !== null) {

              memory.operation = null;
            }

            // If there was an Equation remove the last Character.
            memory.previousOperand =
              memory.previousOperand.includes('=') ? memory.previousOperand.slice(0, -1) : memory.previousOperand;

            // Get nearest Operand.
            // If it is empty and there is a Operation ongoing remove it.
            // Get nearest Operand.
            var nearestOperand = base_calculator.getNearestOperation(memory.previousOperand.toString(), true);

            // Remove the current Operator and switch all values.
            memory.previousOperand = nearestOperand[0];
            memory.currentOperand = nearestOperand[1];
            memory.operation = nearestOperand[2];
            memory.temporayOperand = '';
          }

        } else {

          var current_last_char = memory.currentOperand.charAt(memory.currentOperand.length - 1);
          var current_second_last_char = memory.currentOperand.charAt(memory.currentOperand.length - 2);

          // Validate if the current number is a open Parenthesis.
          if (current_last_char === '(') {

            // Pop one parenthesis.
            memory.parenthesis.pop();

            // Check if the current number is a close Parenthesis.
          } else if (current_last_char === ')') {

            // Push the parenthesis.
            memory.parenthesis.push('(');
          }

          if (!isNaN(current_last_char) && current_second_last_char !== undefined &&
            (current_second_last_char === '.' || current_second_last_char === '-')) {

            // Remove the two last Character.
            memory.currentOperand = memory.currentOperand.toString().slice(0, -2);

          } else {

            // Remove last Character.
            memory.currentOperand = memory.currentOperand.toString().slice(0, -1);

          }

        }

        // Update the base_calculator.
        base_calculator.update();
        $(SELECTORS.CALCULATOR).focus();
      });
    },

    /**
     * clearAllButton
     * Make everything empty again with a Button.
     *
     */
    clearAllButton: function() {

      $(SELECTORS.AC).addEventListener('click', function(e) {
        e.target.blur();
        // Execute the clearAll function at Button press.
        base_calculator.clearAll();
        $(SELECTORS.CALCULATOR).focus();
      });
    },

    /**
     * clearAll
     * Make everything empty again.
     *
     */
    clearAll: function() {

      // Reset the memory
      memory.currentOperand = '';
      memory.previousOperand = '';
      memory.temporayOperand = '';
      memory.operation = null;
      memory.parenthesis = [];

      // Update the base_calculator.
      base_calculator.update();
    },

    /**
     * popoutButton
     * Make the Calculator be draggable.
     *
     */
    popoutButton: function() {
      $(SELECTORS.POPOUT)?.addEventListener('click', () => {
        if (!draggable) {
          draggable = true;

          // Set the CSS Style and Draggable Class.
          Object.assign($(SELECTORS.CALCULATOR).style, CSS.DRAGGABLE_CSS_ON);
          if (CSS.DRAGGABLE_CLASS) {
            $(SELECTORS.CALCULATOR)?.classList.add(CSS.DRAGGABLE_CLASS);
          }
          $(SELECTORS.POPOUT_ICON)?.classList.remove(CSS.POPOUT_CLASS);
          $(SELECTORS.POPOUT_ICON)?.classList.add(CSS.POPOUT_CLOSE_CLASS);

          cstr.get_string('calculator_close', 'block_calculator').done(function(popup) {
            $(SELECTORS.POPOUT_TEXT).textContent = popup;
          });

          // Get the Calculator element
          var calc = $(SELECTORS.CALCULATOR);

          // Set the Position of the Calculator to the Screen Center
          calc.style.top = ((window.innerHeight / 2) - (calc.clientHeight / 2)) + 'px';
          calc.style.left = ((window.innerWidth / 2) - (calc.clientWidth / 2)) + 'px';

        } else {
          draggable = false;

          // Remove the CSS Style and Draggable Class.
          Object.assign($(SELECTORS.CALCULATOR).style, CSS.DRAGGABLE_CSS_OFF);
          if (CSS.DRAGGABLE_CLASS) {
            $(SELECTORS.CALCULATOR)?.classList.remove(CSS.DRAGGABLE_CLASS);
          }
          $(SELECTORS.POPOUT_ICON)?.classList.remove(CSS.POPOUT_CLOSE_CLASS);
          $(SELECTORS.POPOUT_ICON)?.classList.add(CSS.POPOUT_CLASS);

          cstr.get_string('calculator_popout', 'block_calculator').done(function(popup) {
            $(SELECTORS.POPOUT_TEXT).textContent = popup;
          });

        }
      });
    },

    /**
     * getNearestOperation
     * Searches for the next Operation
     * @param {string} str
     * @param {boolean} removeFromString
     *
     */
    getNearestOperation: function(str, removeFromString = false) {

      // Initialize the current Operator Char index;
      var char_until = 0;

      // Loop through the given String backwards.
      for (var c = str.length; c >= 0; c--) {

        // If the current Char exists.
        if (str[c] !== undefined) {

          // Then check if it matches as Operator.
          if (str[c].match(OPERATOR_REGEX)) {

            // If it does match as Operator see if it is a Minus.
            if (str[c] === '-') {

              // It is a Minus Operator so check if a previous Char exists.
              if (str[c - 1] === undefined) {
                // If it does not exist set the char_until to -1.
                char_until = -1;
                break;
                // If there is a previous Char validate whether it is an Operator.
              } else if (str[c - 1].match(OPERATOR_REGEX)) {

                // Set char_until to the previous Char Index.
                char_until = c - 1;
                break;
              }

              continue;
            } else {
              // Otherwise set the char_until to the current Index.
              char_until = c;
              break;
            }
          }
        }
      }

      // Initialize new operation String.
      var operation = '';
      var operator = char_until !== -1 && str[char_until].match(OPERATOR_REGEX) ? str[char_until] : null;

      // Index to get all Chars until the found Operator.
      var chars_index =
        (str[char_until] !== undefined && str[char_until].match(OPERATOR_REGEX) ? char_until + 1 : char_until);

      // Loop through the given operationString within the range of the endIndex and the length of the String
      for (var c = chars_index; c <= str.length; c++) {

        // Verify that there is a Char at the current Index.
        if (str[c] !== undefined) {

          // Add the Characters to the new operation String.
          operation += str[c];
        }
      }

      // If the extracted operation should be removed, simply remove it.
      if (removeFromString) {

        // Remove not needed Part of the String.
        var _str = str.slice(0, char_until !== -1 ? char_until : char_until + 1);

        // Return the sliced string, the new operation String, the new Operator and the endIndex.
        return [_str, operation, operator, char_until];
      }

      // Return the new operation String, the new Operator, and the endIndex.
      return [operation, operator, char_until];
    },

    /**
     * hasNumbers
     * Verify that the operand has numbers.
     * @param {string} str
     */
    hasNumbers: function(str) {

      // Initialize hasNumbers boolean.
      var hasNumbers = false;

      // Loop through the given String.
      for (var i = 0; i < str.length; i++) {

        // Verify that the current Character is not undefined.
        if (str[i] !== undefined) {

          // Verify if the Character is not a not an number. ( is a Number )
          if (!isNaN(str[i])) {

            // Set hasNumbers to true.
            hasNumbers = true;
          }
        }
      }

      return hasNumbers;
    },

    /**
     * validateCorrectParenthesis
     * Verify that the User did not forget to close a Parenthesis.
     * @param {string} str
     */
    validateCorrectParenthesis: function(str) {

      // Initialize parenthesis check Array.
      var parenthesis = [];

      // Loop through the given String.
      for (var i = 0; i < str.length; i++) {

        // Verify that the current Character is not undefined.
        if (str[i] !== undefined) {

          // If the String is a open Parenthesis push it to the check Array.
          if (str[i] == '(') {

            parenthesis.push(str[i]);

          } else if (str[i] == ')') {

            // If it is a closed Parenthesis check if the check Array is empty or not.
            // Check Array is empty.
            if (parenthesis.length == 0) {

              // Push the closed Parenthesis.
              parenthesis.push(str[i]);

            } else {

              // Check Array is not empty.
              // Remove last record of Array.
              parenthesis.pop();

            }

          }
        }
      }

      // If the check Array is empty then there are no errors, otherwise must be an error.
      return parenthesis.length == 0;
    },

    /**
     * translateKey
     * Translate a Key to the matching Div id name
     * @param {string} key
     */
    translateKey: function(key) {
      return KEY_NAME_MAP[key] !== undefined ? KEY_NAME_MAP[key] : key;
    },

    /**
     * keyInput
     * Key events.
     */
    keyInput: function() {
      // Prevent Browser in-site-search with the key "/"
      // 250625 treitmzt: Restrict prevention of slash to calculator focus because it is needed in other input fields.
      window.addEventListener('keypress', function(e) {
        if (e.key == '/' && document.activeElement === $(SELECTORS.CALCULATOR)) {
          e.preventDefault();
        }
      });

      // Focus the Calculator on click
      $(SELECTORS.CALCULATOR).addEventListener('click', () => {
        $(SELECTORS.CALCULATOR).focus();
      });

      // Key Inputs
      $(SELECTORS.CALCULATOR).addEventListener('keydown', e => {
        KEY_MAP.forEach(function(key) {
          if (e.key == key) {

            // Translate the keys
            var translatedKey = base_calculator.translateKey(key);
            var prefix = '#data-block-';

            var element = $(prefix + translatedKey);
            if (element && element.classList) {
              element.classList.add('data-block-calculator-pseudo-active');
            }
          }
        });
      });

      // Key Inputs
      $(SELECTORS.CALCULATOR).addEventListener('keyup', e => {
        KEY_MAP.forEach(function(key) {
          if (e.key == key) {

            // Translate the keys
            var translatedKey = base_calculator.translateKey(key);
            var prefix = '#data-block-';

            // Press the Key button
            var element = $(prefix + translatedKey);
            if (element) {
              element.click();
              if (element.classList) {
                element.classList.remove('data-block-calculator-pseudo-active');
              }
            }
          }
        });
      });
    },

    /**
     * drag
     * drag events.
     */
    drag: function() {
      var dragHeader = $(SELECTORS.CALCULATOR_DRAG_HEADER);
      if (!dragHeader) {
        return;
      }

      dragHeader.addEventListener('mousedown', e => {

        if (draggable) {
          // Unfocus the Calculator
          $(SELECTORS.CALCULATOR).blur();

          // Prevent Default Behavior.
          e.preventDefault();

          // Get and Set die Client X and Y.
          position.clientX = e.clientX;
          position.clientY = e.clientY;

          var mouseMoveHandler = function(e) {
            // Prevent Default Behavior
            e.preventDefault();

            // Calculate new Mouseposition based on the Clients X and Y at the Start of the dragging and
            // of the new Position.
            position.X = position.clientX - e.clientX;
            position.Y = position.clientY - e.clientY;

            // Set the client X and Y to the newer Position.
            position.clientX = e.clientX;
            position.clientY = e.clientY;

            // Get the Calculator element
            var calc = $(SELECTORS.CALCULATOR);

            // Get current position
            var rect = calc.getBoundingClientRect();

            // Set the new Calculator Position.
            calc.style.top = (rect.top - position.Y) + 'px';
            calc.style.left = (rect.left - position.X) + 'px';
          };

          var mouseUpHandler = function(e) {
            // Prevent Default Behavior.
            e.preventDefault();

            // Remove MouseMove and MouseUp Event.
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
          };

          // Listen on the Mouseup Event.
          document.addEventListener('mouseup', mouseUpHandler);

          // Listen on the MouseMove Event.
          document.addEventListener('mousemove', mouseMoveHandler);
        }
      });
    },

    /**
     * calculate
     * calculations.
     */
    calculate: function() {

      // Add the Equals Operator on the Output if there is no.
      if (!memory.previousOperand.toString().includes('=')) {
        // Boolean to validate the correct Parenthesis format.
        var validateParenthesis = this.validateCorrectParenthesis(memory.previousOperand.toString() +
          (memory.operation === null ? '' : memory.operation.toString()) +
          memory.currentOperand.toString()
        );

        memory.previousOperand = memory.previousOperand.toString() +
          (memory.operation === null ? '' : memory.operation.toString()) +
          memory.currentOperand.toString();

        // If the Parenthesis are correct Calculate.
        if (!validateParenthesis) {

          if (memory.previousOperand[memory.previousOperand.length - 1] === '(') {
            memory.previousOperand = memory.previousOperand + "0";
          }

          // Loop through the leftover Parenthesis and append them to the result String.
          while (memory.parenthesis.length > 0) {
            memory.previousOperand = memory.previousOperand.toString() + ")";
            memory.parenthesis.shift();
          }

        }

        memory.previousOperand = memory.previousOperand.toString() + '=';

        // Set the Result to the Calculation String and remove the Equals Operator.
        var result = memory.previousOperand.slice(0, memory.previousOperand.length - 1);

        // Reset the Memory.
        memory.currentOperand = '';
        memory.temporayOperand = '';
        memory.operation = null;

        if (base_calculator.hasNumbers(memory.previousOperand)) {
          if (!result.match(/÷0(?!\.)|÷-0(?!\.)/)) {

            // Create a new RPNEvaluator and format the Result with the Shunting Yard Algorithm.
            result = new RPNEvaluator(new ShuntingYardConverter().toRPN(result)).eval();

            if (result === '-0') {
              result = '0';
            }

            // Check if there is a result.
            if (result !== null) {
              if (result === 'NaN' || result === 'Infinity') {

                memory.currentOperand = '0';
                memory.temporayOperand = '0';
                memory.operation = null;

                cstr.get_string('invalidinput', 'block_calculator').done(function(msg) {
                  $(SELECTORS.CURRENTOPERAND).textContent = msg;
                });

              } else {
                // set the Result to the current Operand.
                memory.currentOperand = result;
                memory.temporayOperand = result;
              }

            } else {

              // If there is no result.
              // Reset the Memory.
              memory.currentOperand = '0';
              memory.temporayOperand = '0';
              memory.operation = null;

              // Set the Text to Error
              cstr.get_string('invalidinput', 'block_calculator').done(function(msg) {
                $(SELECTORS.CURRENTOPERAND).textContent = msg;
              });
            }
          } else {

            memory.previousOperand = "";
            this.update();

            cstr.get_string('calculator_divide_by_zero', 'block_calculator').done(function(msg) {
              $(SELECTORS.CURRENTOPERAND).textContent = msg;
            });

          }
        } else {

          memory.currentOperand = '0';
        }
      }

      // Update the Display.
      this.update();
    },

    /**
     * Update
     * update the base_calculator.
     * @param {string} currentOperand
     * @param {string} previousOperand
     * @param {string} operation
     */
    update: function(currentOperand = null, previousOperand = null, operation = null) {

      // If Parameter is null get the Values from the memory.
      currentOperand = currentOperand === null ? memory.currentOperand : currentOperand;
      previousOperand = previousOperand === null ? memory.previousOperand : previousOperand;
      operation = operation === null ? memory.operation : operation;

      // Set the current Operand text to the currentOperrand Value.
      $(SELECTORS.CURRENTOPERAND).textContent = currentOperand.valueOf();

      // Set Parenthesis checker Text.
      $(SELECTORS.OPENPARENTHESISCOUNT).textContent = memory.parenthesis.length != 0 ? memory.parenthesis.length : "";

      // When there is a operation given set the previous Operand Text with the operation after.
      if (operation !== null) {

        $(SELECTORS.PREVIOUSOPERAND).textContent = previousOperand + operation;
      } else {

        // Otherwise set the text to be empty.
        $(SELECTORS.PREVIOUSOPERAND).textContent = previousOperand;
      }
    }
  };
  return base_calculator;
});
