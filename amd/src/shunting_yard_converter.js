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

define(["block_simple_calculator/stack"], function(Stack) {
  /**
    * StringToChars
    * A Class to convert a String into an Array of the Characters.
    */
  class StringToChars {
    /**
    * constructor
    * Convert a String into an Array of the Characters.
    * @param {string} str
    */
    constructor(str) {
      // Declare the Chars array.
      var chars = [];

      // Loop through all Chars.
      for (var c = 0; c < str.length; c++) {
        // Push the chars into the chars Array.
        chars.push(str[c]);
      }
      // Return the Chars array.
      return chars;
    }
  }
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
      this.precedence = { neg: 4, "*": 3, "÷": 3, "+": 2, "-": 2 };
    }

    isOperator(char) {
      return char.match(/\+|\-|\*|÷/);
    }

    toRPN(str) {
      this.chars = new StringToChars(str);
      var parse_as_float = false;
      var parse_until_op = false;

      while (this.chars.length > 0) {
        var char = this.chars[0];

        if (!isNaN(char)) {
          if (parse_as_float || parse_until_op) {
            this.output_stack.push(this.output_stack.pop() + char);
          } else {
            this.output_stack.push(parseFloat(char));
            if (!parse_until_op) {
              parse_until_op = true;
            }
          }
        } else if (this.isOperator(char)) {
          parse_as_float = false;
          parse_until_op = false;

          while (
            (this.operator_stack.peek() !== undefined &&
              this.operator_stack.peek() !== "(" &&
              this.precedence[this.operator_stack.peek()] >
                this.precedence[char]) ||
            this.precedence[this.operator_stack.peek()] ===
              this.precedence[char]
          ) {
            this.output_stack.push(this.operator_stack.pop());
          }

          this.operator_stack.push(char);
        } else if (isNaN(char) && !char.match(/\.|\(|\)|\+|\-|\*|÷/)) {
          if (
            this.operator_stack.peek() !== undefined &&
            isNaN(this.operator_stack.peek()) &&
            !this.operator_stack.peek().match(/\.|\(|\)|\+|\-|\*|÷/)
          ) {
            this.operator_stack.push(this.operator_stack.pop() + char);
          } else {
            this.operator_stack.push(char);
          }
        } else if (char === ".") {
          parse_as_float = true;
          this.output_stack.push(this.output_stack.pop() + char);
        } else if (char === "(") {
          this.operator_stack.push(char);
        } else if (char === ")") {
          while (
            this.operator_stack.peek() !== undefined &&
            this.operator_stack.peek() !== "("
          ) {
            this.output_stack.push(this.operator_stack.pop());
          }
          if (this.operator_stack.peek() === "(") {
            this.operator_stack.pop();
          }
        }

        this.chars.shift();
      }

      while (this.operator_stack.peek() !== undefined) {
        if (this.operator_stack.peek() !== "(") {
          this.output_stack.push(this.operator_stack.pop());
        }
      }
      return this.output_stack;
    }
  }
  return ShuntingYardConverter;
});
