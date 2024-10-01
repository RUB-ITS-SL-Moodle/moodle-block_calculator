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
 * A String Converter based of the Shunting Yard Algorithm to convert a Calculation String into the RPN format.
 *
 * @module      block_simple_calculator/shunting_yard_converter
 * @copyright   2024 Leon Berau <leon.berau@ruhr-uni-bochum.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Define the needed Stack Class.
define(['block_simple_calculator/stack'], function (Stack) {

  /**
   * ShuntingYardConverter
   * A Converter based of the Shunting Yard Algorithm to convert a Calculation String into the RPN Format.
   */
  class ShuntingYardConverter {

    /**
     * constructor
     * Initialize the Operator Stack, Output Stack and the precedence Object.
     */
    constructor() {
      this.operator_stack = new Stack();
      this.output_stack = new Stack();
      this.precedence = { '*': 3, '÷': 3, '+': 2, '-': 2 };
    }

    /**
     * isOperator
     * Matches the given Character and checks if it is an Operator.
     * @param {string} char
     */
    isOperator(char) {
      return char.match(/\+|\-|\*|÷|e/);
    }

    /**
     * toRPN
     * Converts a Infix Notation into the Reversed Polish Notation.
     * @param {string} str
     */
    toRPN(str) {
      // Map the String into a Array of chars.
      this.chars = [...str];

      // Declare the parsing booleans an the next and previous chars.
      var parse_as_float = false;
      var parse_until_op = false;
      var previous_char = "";

      while (this.chars.length > 0) {
        var char = this.chars[0];

        // If the current char is a Number.
        if (!isNaN(char)) {

          // Check if parse as float or parse until operator is true.
          if (parse_as_float || parse_until_op) {

            // Push the current number to the last number Element from the output-stack.
            this.output_stack.push(this.output_stack.pop() + char);
          } else {
            // Parse as float and parse until operator is false.
            // Push the number into the output-stack.
            this.output_stack.push(char);

            // Validate if parse until operator is false.
            if (!parse_until_op) {

              // Set it as true to be able to parse a whole number, not only one Character of it.
              parse_until_op = true;
            }
          }

          // If the Character is a Operator based of the isOperator function.
        } else if (this.isOperator(char)) {

          // Set parse as float and parse until opertor to false.
          parse_as_float = false;
          parse_until_op = false;


          if (char === '-' && !this.output_stack.isEmpty() &&
            this.output_stack.peek()[this.output_stack.peek().length - 1] === 'e') {

            // Push the Operator to the last Element of the output Stack.
            this.output_stack.push(this.output_stack.pop() + char);
            parse_until_op = true;

            // Char is at the start of the Empty String or after a open parenthesis
            // or after a Operator then it is a negative number.
          } else if (char === '-' && (this.output_stack.isEmpty() || previous_char === '(' || this.isOperator(previous_char))) {

            // Push the negative number to the output-stack and set parse until op as true.
            this.output_stack.push(char);
            parse_until_op = true;

          } else if (char === '+' && !this.output_stack.isEmpty() &&
            this.output_stack.peek()[this.output_stack.peek().length - 1] === 'e') {

            // Push the Operator to the last Element of the output Stack.
            this.output_stack.push(this.output_stack.pop() + char);
            parse_until_op = true;

            // Char is at the start of the Empty String or after a open parenthesis
            // or after a Operator then it is a big number.
          } else if (char === '+' && (this.output_stack.isEmpty() || previous_char === '(' || this.isOperator(previous_char))) {

            // Push the negative number to the output-stack and set parse until op as true.
            this.output_stack.push(char);
            parse_until_op = true;

          } else {
            // Check if the current Char is an "e".
            if (char === 'e') {
              // Push the Exponent to the last Element of the output Stack.
              this.output_stack.push(this.output_stack.pop() + char);
            } else {

              /* While the char at the top of the operator-stack is not a open Parenthesis and the char at the top has a
                 higher precedence than the current Char or the same Precedence push the char out of the operator-stack
                 intto the output-stack.
              */
              while ((this.operator_stack.peek() !== undefined && this.operator_stack.peek() !== '(' &&
                this.precedence[this.operator_stack.peek()] > this.precedence[char]) ||
                this.precedence[this.operator_stack.peek()] === this.precedence[char]) {

                // Push the Char out of the operator-stack into the output-stack.
                this.output_stack.push(this.operator_stack.pop());
              }

              // Push the current Char into the operator-stack.
              this.operator_stack.push(char);
            }
          }

          // Check for a decimal Number.
        } else if (char === '.') {

          // Set parsing as float to true.
          parse_as_float = true;

          // And merge the "." to the previous output-stack Element.
          this.output_stack.push(this.output_stack.pop() + char);

          // If the Char is a open Parenthesis.
        } else if (char === '(') {

          // Push it into the operator-stack.
          this.operator_stack.push(char);

          // If it is an closing Parenthesis.
        } else if (char === ')') {

          // Loop aslong as the top layer of the operator-steck is not undefined and not a opening parenthesis.
          while (this.operator_stack.peek() !== undefined && this.operator_stack.peek() !== '(') {

            // Push the top Element from the operator-stack into the output-stack.
            this.output_stack.push(this.operator_stack.pop());
          }

          // Should the top layer from the operator-stack be a open Parenthesis.
          if (this.operator_stack.peek() === '(') {

            // Remove it.
            this.operator_stack.pop();
          }
        }

        // If theres only one Char left and the parse as float/ until op is still true set it to false.
        if (this.chars.length == 1 && (parse_as_float || parse_until_op)) {
          parse_until_op = false;
          parse_as_float = false;
        }

        // Set the previous Character.
        previous_char = this.chars[0];
        // Remove the first Element of the Chars array.
        this.chars.shift();
      }

      // While the operator-stack is not empty loop through it.
      while (this.operator_stack.peek() !== undefined) {

        // Check if the current Top Element is a open Parenthesis.
        if (this.operator_stack.peek() !== '(') {

          // Push the current operator-stack Top into the output-stack.
          this.output_stack.push(this.operator_stack.pop());
        }

      }

      // Return the converted Output.
      return this.output_stack;
    }
  }
  // Return the ShuntingYardConverter Class.
  return ShuntingYardConverter;
});
