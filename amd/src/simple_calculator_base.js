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
  POPOUT: '.button-block-calculator-popout',
  POPOUT_TEXT: '#button-block-calculator-popout-text',
  POPOUT_ICON: '#button-block-calculator-popout-icon'
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
  POPOUT_CLOSE_CLASS: 'fa-circle-xmark'
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
  'Escape'
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
  operation: null
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

      // Key Events
      this.keyInput();

      //Function Evnts
      this.drag();
    },

    /**
     * numbersButton
     * Numbers button action.
     *
     */
    numbersButton: function () {
      $(SELECTORS.NUMBERS).each(function () {
        $(this).on('click', function () {
          var number = $(this).text();

          // Verify if the currentOperand already has a point.
          if (number === '.' && memory.currentOperand.includes('.')) {

            // Just update.
            base_calculator.update();
          } else {

            // If the temporaryOperand is not empty set the current Operand to the new Number.
            if (memory.temporayOperand !== '') {

              // If there was a Calculation before reset the previous Operand.
              if (memory.previousOperand.includes('=')) {

                memory.previousOperand = '';
              }

              // Set the new current Operand.
              memory.currentOperand = number.toString();

              // Empty the temporary Operand.
              memory.temporayOperand = '';
            } else {

              // Append the new Number to the currentOperand.
              memory.currentOperand = memory.currentOperand.toString() + number.toString();
            }
          }

          // Update the Calculator
          base_calculator.update();
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
        $(this).on('click', function () {
          var operation = $(this).text();

          // If Operator is equals to +/- and the current Operand is empty and has Numbers in it then negate.
          if (memory.currentOperand !== '' && base_calculator.hasNumbers(memory.currentOperand) &&
            operation === '+/-') {

            // Valdiate if the current Operand has already a negative number
            if (!memory.currentOperand.includes('neg(')) {

              // Has no negative Number, declare a temporary Operand string.
              var tempOperand = '';

              // Loop through all Chars.
              for (var c = 0; c < memory.currentOperand.length; c++) {

                // Check the Char is not a Parenthesis
                if (!memory.currentOperand[c].match(/\(|\)/)) {

                  // It is not a Parenthesis and if it dont have a negative Number already.
                  if (!tempOperand.includes('neg(')) {

                    // Add Negative to the temporary Operand.
                    tempOperand += 'neg(';
                  }

                  // Add the Numbers to the temporary Operand.
                  tempOperand += memory.currentOperand[c];
                } else {

                  // Add the Parenthesis to the temporary Operand.
                  tempOperand += memory.currentOperand[c];
                }
              }

              // Add a closing Parenthesis for the negate.
              tempOperand += ')';

              // Set the currentOperand to the new created temporary Operand.
              memory.currentOperand = tempOperand;

            } else {
              // It has an Negate so remove the neg(.
              memory.currentOperand = memory.currentOperand.replace('neg(', '');

              // Remove the last Character ( The closing parenthesis).
              memory.currentOperand = memory.currentOperand.slice(0, -1);

            }

          } else if (memory.currentOperand !== '' && memory.previousOperand !== '' && memory.operation !== null &&
            base_calculator.hasNumbers(memory.currentOperand)) {

            // If the previous and current are not empty and a operation gets pressed add the current to the previous.
            memory.previousOperand = memory.previousOperand.toString() + memory.operation.toString() +
              memory.currentOperand.toString();

            memory.temporayOperand = memory.currentOperand;
            memory.operation = operation;

          } else if (memory.previousOperand !== '' && memory.currentOperand !== '' && memory.operation === null &&
            base_calculator.hasNumbers(memory.currentOperand) && memory.previousOperand.includes('=')) {

            // If there was a Calculation before set the previous Operand to the current Operand.
            if (memory.currentOperand.includes('-')) {

              memory.previousOperand = `neg(${memory.currentOperand.replace('-', '')})`;
            } else {

              memory.previousOperand = memory.currentOperand;
            }

            memory.currentOperand = '';
            memory.operation = operation;

          } else if (memory.currentOperand !== '' && memory.previousOperand === '' &&
            base_calculator.hasNumbers(memory.currentOperand)) {

            // If the current Operand is not empty and previous Operand is empty set temporaryOperand.
            memory.previousOperand = memory.currentOperand;
            memory.temporayOperand = memory.currentOperand;
            memory.operation = operation;
          }

          // Update the base_calculator.
          base_calculator.update();
        });
      });
    },

    /**
     * equalsButton
     * Starts to calculate.
     *
     */
    equalsButton: function () {
      $(SELECTORS.EQUALS).on('click', function () {
        base_calculator.calculate();
      });
    },

    /**
     * deleteButton
     * Remove one character from operand.
     *
     */
    deleteButton: function () {
      $(SELECTORS.DELETE).on('click', function () {

        if (memory.currentOperand !== '') {

          // Remove one character from the current Operand.
          if (memory.currentOperand.toString()[memory.currentOperand.length - 1] == ')' &&
            memory.currentOperand.toString().includes('neg(')) {

            var firstParenthesis = null;

            // Loop through all Characters to get the first Parenthesis.
            for (var c = 0; c < memory.currentOperand.length; c++) {

              if (memory.currentOperand.toString()[c] === ')') {
                firstParenthesis = c;
                break;
              }
            }

            if (firstParenthesis == memory.currentOperand.length - 1 &&
              !memory.currentOperand.toString()[firstParenthesis - 1].match('/[0-9]/')) {

              // It has an Negate so remove the neg(.
              memory.currentOperand = memory.currentOperand.toString().replace('neg(', '');

              // Remove the last Character ( The closing parenthesis).
              memory.currentOperand = memory.currentOperand.toString().slice(0, -1);
            } else {

              // Remove last Character.
              memory.currentOperand = memory.currentOperand.toString().slice(0, -1);
            }
          } else {

            // Remove last Character.
            memory.currentOperand = memory.currentOperand.toString().slice(0, -1);
          }
        } else if (memory.operation !== null) {

          // If it is empty and there is a Operation ongoing remove it.
          // Get nearest Operand.
          var nearestOperand = base_calculator.getNearestOperation(memory.previousOperand.toString(), true);

          // Remove the current Operator and switch all values.
          memory.previousOperand = nearestOperand[0];
          memory.currentOperand = nearestOperand[1];
          memory.operation = nearestOperand[2];
          memory.temporayOperand = '';
        }

        // Update the base_calculator.
        base_calculator.update();
      });
    },

    /**
     * clearAllButton
     * Make everything empty again with a Button.
     *
     */
    clearAllButton: function () {

      $(SELECTORS.AC).on('click', function () {

        // Execute the clearAll function at Button press.
        base_calculator.clearAll();
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
     * @param {string} operationString
     * @param {boolean} removeFromString
     *
     */
    getNearestOperation: function (operationString, removeFromString = false) {

      // Current endIndex and count of operators in String.
      var endIndex = false;
      var countOperations = 0;

      // Search through the given operationString for operators backwards.
      for (var x = operationString.length; x >= 0; x--) {

        // If the Character at the Index of x is not undefined and matches the Regex,
        // set the endIndex if it is not already set.
        if (operationString[x] !== undefined && operationString[x].match(OPERATOR_REGEX)) {

          // Verify if endIndex has not been set.
          if (endIndex == false) {
            endIndex = x;
          }

          // Count the operations.
          countOperations++;
        }
      }

      // Initialize new operation String.
      var operation = '';

      // Loop through the given operationString within the range of the endIndex and the length of the String
      for (var i = endIndex ? endIndex + 1 : 0; i <= operationString.length - 1; i++) {

        // Add the Characters to the new operation String.
        operation += operationString[i];

      }

      // If the extracted operation should be removed, simply remove it.
      if (removeFromString) {

        // Get the new Operator based off the endIndex.
        var newOperator = operationString[endIndex];

        // Initialize the sliced new String.
        var operationStringSliced = '';

        // Check if there are more than 1 Operators in the operationString or not.
        // If it's true slice it.
        if (countOperations !== 0) {

          // Slice the String by the endIndex and length of the operationString.
          operationStringSliced = operationString.slice(0, (countOperations >= 1 ? endIndex - 1 : endIndex) -
                                  (operationString.length - 1));
        }

        // Should the Sliced String be undefined set it as empty String.
        if (operationStringSliced === undefined) {
          operationStringSliced = '';
        }

        // Set the newOperator equals to null when it is undefined.
        if (newOperator === undefined) {
          newOperator = null;
        }

        // Return the sliced string, the new operationString, the new Operator and the endIndex.
        return [operationStringSliced, operation, newOperator, endIndex];
      }

      // Return the new operationString, the new Operator, and the endIndex.
      return [operation, operationString[endIndex], endIndex];
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
      $(SELECTORS.CALCULATOR).keydown(e => {
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
      // Boolean to validate the correct Parenthesis format.
      var validateParenthesis = this.validateCorrectParenthesis(memory.previousOperand.toString() +
        (memory.operation === null ? '' : memory.operation.toString()) +
        memory.currentOperand.toString()
      );

      // Add the Equals Operator on the Output if there is no.
      if (!memory.previousOperand.toString().includes('=')) {

        memory.previousOperand = memory.previousOperand.toString() +
          (memory.operation === null ? '' : memory.operation.toString()) +
          memory.currentOperand.toString() + '=';

      }

      // Set the Result to the Calculation String and remove the Equals Operator.
      var result = memory.previousOperand.slice(0, memory.previousOperand.length - 1);

      // Reset the Memory.
      memory.currentOperand = '';
      memory.temporayOperand = '';
      memory.operation = null;

      // If the Parenthesis are correct Calculate.
      if (validateParenthesis) {
        // Create a new RPNEvaluator and format the Resul with the Shunting Yard Algorithm.
        result = new RPNEvaluator(new ShuntingYardConverter().toRPN(result)).eval();
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
      }
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
