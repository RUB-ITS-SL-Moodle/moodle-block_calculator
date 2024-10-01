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
 * Adds the functionality of a simple Calculator.
 *
 * @module      block_simple_calculator/rpn_evaluator
 * @copyright   2024 Leon Berau <leon.berau@ruhr-uni-bochum.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Define the needed DecimalJS and the Stack Class.
define(["block_simple_calculator/decimal", "block_simple_calculator/stack"], function (decimaljs, Stack) {

  /**
   * RPNEvaluator
   * Evaluate from a given Stack in the Reversed Polish Notation.
   */
  class RPNEvaluator {

    /**
     * constructor
     * Creates the RPNEvaluator.
     * @param {array} input
     */
    constructor(input) {
      // Initialize a new Calculate-Stack and set the Output-Stack.s
      this.output_stack = input;
      this.calculate_stack = new Stack();
    }

    /**
     * eval
     * Evaluate the given Stack and return the result.
     */
    eval() {

      // While there are chars left in the output_stack.
      while (this.output_stack.stack.length > 0) {

        // Declare the current Char and remove it from the output-stack simultaneously.
        var char = this.output_stack.shift();

        // If the current Char is a number.
        if (!isNaN(char)) {

          // Push the char into the calculate-stack.
          this.calculate_stack.push(char);

          // Validate if the current Char is an Operator.
        } else if (this.isOperator(char)) {

          // Get the right and left numbers and convert it into a DecimalJS Number.
          var right = new decimaljs.Decimal(this.calculate_stack.pop());
          var left = new decimaljs.Decimal(0);

          if (!this.calculate_stack.isEmpty()) {
            left = new decimaljs.Decimal(this.calculate_stack.pop());
          }

          // Switch through the current Operator
          switch (char) {
            case "+":
              // Add the two numbers and push the Addition result into the calculate-stack.
              this.calculate_stack.push(left.add(right).valueOf());
              break;
            case "-":
              // Subtract the two numbers and push the Subtraction result into the calculate-stack.
              this.calculate_stack.push(left.sub(right).valueOf());
              break;
            case "*":
              // Multiply the two numbers and push the Multiplication result into the calculate-stack.
              this.calculate_stack.push(left.mul(right).valueOf());
              break;
            case "÷":
              // Divide the two numbers and push the Division result into the calculate-stack.
              this.calculate_stack.push(left.div(right).valueOf());
              break;

          }
        }
      }

      // Return the Result of the Calculation.
      return this.calculate_stack.pop();
    }

    /**
     * isOperator
     * Matches the given Character and checks if it is an Operator.
     * @param {string} char
     */
    isOperator(char) {
      return char.match(/\+|\-|\*|÷/);
    }
  }

  // Return the RPNEValuator Class.
  return RPNEvaluator;
});
