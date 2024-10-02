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
 * Adds the base function of a Calculator.
 *
 * @module      block_simple_calculator/simple_calculator_base
 * @copyright   2024 Leon Berau <leon.berau@ruhr-uni-bochum.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

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
  DRAGGABLE_CSS_OFF: { position: '', width: '', 'z-index': '', visibility: '' },
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
var position = { clientX: 0, clientY: 0, X: 0, Y: 0, offset: 0 };

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

/**
 * Define jQuery and the DecimalJS for the Calculator to use.
 * @param {object} $
 * @param {object} decimaljs
 */
define([
  'jquery',
  'core/str',
  'block_simple_calculator/shunting_yard_converter',
  'block_simple_calculator/rpn_evaluator'
], function ($, cstr, ShuntingYardConverter, RPNEvaluator) {
  var base_calculator = {
    /**
     * init
     * Initialize the Calculator
     */
    init: function () {
      // Register the plugin Javascript Events.
      this.registerEvents();
    },

    /**
     * registerEvents
     * Register and listen to all Events.
     */
    registerEvents: function () {
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

      //Function Evnts
      this.drag();
    },

    /**
     * collapseButton
     * Toggles an Accordion Collapse.
     *
     */
    collapseButton: function () {
      $(SELECTORS.COLLAPSE_BUTTON).on('click', function () {
        $(SELECTORS.COLLAPSE_BODY).toggle();

        if ($(SELECTORS.COLLAPSE_BODY).css("display") == "block") {
          $(SELECTORS.COLLAPSE_BUTTON).removeClass(CSS.COLLAPSE_ICON_HIDDEN);
          $(SELECTORS.COLLAPSE_BUTTON).addClass(CSS.COLLAPSE_ICON_SHOWN);
        } else {
          $(SELECTORS.COLLAPSE_BUTTON).addClass(CSS.COLLAPSE_ICON_HIDDEN);
          $(SELECTORS.COLLAPSE_BUTTON).removeClass(CSS.COLLAPSE_ICON_SHOWN);
        }
      });
    },

    /**
     * numbersButton
     * Numbers button action.
     *
     */
    numbersButton: function () {
      $(SELECTORS.NUMBERS).each(function () {
        $(this).on('click', function (e) {
          e.target.blur();
          var number = $(this).data('char');

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
                if (!memory.currentOperand.includes('.')) {
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
                    //Otherwise add the current operand to the previous with the current number.
                    memory.previousOperand = memory.previousOperand.toString() +
                      memory.operation.toString() + memory.currentOperand.toString() + number.toString();
                  } else {
                    //Otherwise add the current operand to the previous with the current number.
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
          $(SELECTORS.CALCULATOR).focus();
        });
      });
    },

    /**
     * operationsButton
     * Operations button action.
     *
     */
    operationsButton: function () {
      $(SELECTORS.OPERATIONS).each(function () {
        $(this).on('click', function (e) {
          e.target.blur();
          var operation = $(this).data('char');

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
    equalsButton: function () {
      $(SELECTORS.EQUALS).on('click', function (e) {
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
    deleteButton: function () {
      $(SELECTORS.DELETE).on('click', function (e) {
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
    clearAllButton: function () {

      $(SELECTORS.AC).on('click', function (e) {
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
    clearAll: function () {

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
    popoutButton: function () {
      $(document).on('click', SELECTORS.POPOUT, () => {
        if (!draggable) {
          draggable = true;

          // Set the CSS Style and Draggable Class.
          $(SELECTORS.CALCULATOR).css(CSS.DRAGGABLE_CSS_ON);
          $(SELECTORS.CALCULATOR).addClass(CSS.DRAGGABLE_CLASS);
          $(SELECTORS.POPOUT_ICON).removeClass(CSS.POPOUT_CLASS);
          $(SELECTORS.POPOUT_ICON).addClass(CSS.POPOUT_CLOSE_CLASS);

          cstr.get_string('calculator_close', 'block_simple_calculator').done(function (popup) {
            $(SELECTORS.POPOUT_TEXT).text(popup);
          });

        } else {
          draggable = false;

          // Remove the CSS Style and Draggable Class.
          $(SELECTORS.CALCULATOR).css(CSS.DRAGGABLE_CSS_OFF);
          $(SELECTORS.CALCULATOR).removeClass(CSS.DRAGGABLE_CLASS);
          $(SELECTORS.POPOUT_ICON).removeClass(CSS.POPOUT_CLOSE_CLASS);
          $(SELECTORS.POPOUT_ICON).addClass(CSS.POPOUT_CLASS);

          cstr.get_string('calculator_popout', 'block_simple_calculator').done(function (popup) {
            $(SELECTORS.POPOUT_TEXT).text(popup);
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
    getNearestOperation: function (str, removeFromString = false) {

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
    hasNumbers: function (str) {

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
    validateCorrectParenthesis: function (str) {

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
    translateKey: function (key) {
      // Switch through all possible keys and return the translated key.
      switch (key) {
        case '/': key = 'divide';
          break;
        case 'Enter':
          key = 'equals';
          break;
        case 'Backspace':
          key = 'DEL';
          break;
        case 'Escape':
          key = 'AC';
          break;
        case ',':
          key = 'decimal';
          break;
        case '.':
          key = 'decimal';
          break;
        case '+':
          key = 'plus';
          break;
        case '-':
          key = 'minus';
          break;
        case '*':
          key = 'multiply';
          break;
        case '(':
          key = 'parenthesis-open';
          break;
        case ')':
          key = 'parenthesis-close';
          break;
        case 'n':
          key = 'negative';
          break;
      }

      return key;
    },

    /**
     * keyInput
     * Key events.
     */
    keyInput: function () {
      // Prevent Browser in-site-search with the key "/"
      $(window).keypress(function (e) {
        if (e.key == '/') {
          e.preventDefault();
        }
      });

      // Focus the Calculator on click
      $(SELECTORS.CALCULATOR).click(() => {
        $(this).focus();
      });

      // Key Inputs
      $(SELECTORS.CALCULATOR).keyup(e => {
        $(KEY_MAP).each(function (index) {
          if (e.key == KEY_MAP[index]) {

            var key = KEY_MAP[index];
            var prefix = '#data-block-';

            // Translate the keys
            key = base_calculator.translateKey(key);

            // Press the Key button
            $(prefix + key).click();
          }
        });
      });
    },

    /**
     * drag
     * drag events.
     */
    drag: function () {
      $(SELECTORS.CALCULATOR_DRAG_HEADER).on('mousedown', e => {

        if (draggable) {
          // Unfocus the Calculator
          $(SELECTORS.CALCULATOR).blur();


          // Prevent Default Behavior.
          e.preventDefault();

          // Get and Set die Client X and Y.
          position.clientX = e.clientX;
          position.clientY = e.clientY;

          // Listen on the Mouseup Event.
          $(document).on('mouseup', e => {

            // Prevent Default Behavior.
            e.preventDefault();

            // Remove MouseMove and MouseUp Event.
            $(document).off('mousemove', null);
            $(document).off('mouseup', null);
          });

          // Listen on the MouseMove Event.
          $(document).on('mousemove', e => {
            // Prevent Default Behavior
            e.preventDefault();

            // Calculate new Mouseposition based on the Clients X and Y at the Start of the dragging and
            // of the new Position.
            position.X = position.clientX - e.clientX;
            position.Y = position.clientY - e.clientY;

            // Set the client X and Y to the newer Position.
            position.clientX = e.clientX;
            position.clientY = e.clientY;

            // Get the Offset from the base_calculator.
            position.offset = $(SELECTORS.CALCULATOR).offset();

            // Set the new Calculator Position.
            $(SELECTORS.CALCULATOR).offset({
              top: position.offset.top - position.Y,
              left: position.offset.left - position.X
            });
          });
        }
      });
    },

    /**
     * calculate
     * calculations.
     */
    calculate: function () {

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

            if (result === '-0') { result = '0'; }

            // Check if there is a result.
            if (result !== null) {

              // set the Result to the current Operand.
              memory.currentOperand = result;
              memory.temporayOperand = result;
            } else {

              // If there is no result.
              // Reset the Memory.
              memory.currentOperand = '';
              memory.temporayOperand = '';
              memory.operation = null;

              // Set the Text to Error
              memory.currentOperand = 'Error';
              memory.temporayOperand = 'Error';
            }
          } else {

            memory.previousOperand = "";
            this.update();

            cstr.get_string('calculator_divide_by_zero', 'block_simple_calculator').done(function (msg) {
              $(SELECTORS.CURRENTOPERAND).text(msg);
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
    update: function (currentOperand = null, previousOperand = null, operation = null) {

      // If Parameter is null get the Values from the memory.
      currentOperand = currentOperand === null ? memory.currentOperand : currentOperand;
      previousOperand = previousOperand === null ? memory.previousOperand : previousOperand;
      operation = operation === null ? memory.operation : operation;

      // Set the current Operand text to the currentOperrand Value.
      $(SELECTORS.CURRENTOPERAND).text(currentOperand.valueOf());

      // Set Parenthesis checker Text.
      $(SELECTORS.OPENPARENTHESISCOUNT).text(memory.parenthesis.length != 0 ? memory.parenthesis.length : "");

      // When there is a operation given set the previous Operand Text with the operation after.
      if (operation !== null) {

        $(SELECTORS.PREVIOUSOPERAND).text(previousOperand + operation);
      } else {

        // Otherwise set the text to be empty.
        $(SELECTORS.PREVIOUSOPERAND).text(previousOperand);
      }
    }
  };
  return base_calculator;
});
