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

define(["block_simple_calculator/decimal", "block_simple_calculator/stack"], function (decimaljs, Stack) {
  class RPNEvaluator {

    constructor(input) {
      this.output_stack = input;
      this.calculate_stack = new Stack();
    }

    eval() {

      while (this.output_stack.stack.length > 0) {

        var char = this.output_stack.shift();

        if (!isNaN(char)) {

          this.calculate_stack.push(char);

        } else if (char === "neg") {

          var left = this.calculate_stack.pop();
          left = "-" + left;
          this.calculate_stack.push(left);

        } else if (this.isOperator(char)) {

          var right = new decimaljs.Decimal(this.calculate_stack.pop());
          var left = new decimaljs.Decimal(this.calculate_stack.pop());

          switch (char) {
            case "+":
              this.calculate_stack.push(left.add(right).valueOf());
              break;
            case "-":
              this.calculate_stack.push(left.sub(right).valueOf());
              break;
            case "*":
              this.calculate_stack.push(left.mul(right).valueOf());
              break;
            case "÷":
              this.calculate_stack.push(left.div(right).valueOf());
              break;
          }
        }
      }

      return this.calculate_stack.pop();
    }

    isOperator(char) {
      return char.match(/\+|\-|\*|÷/);
    }
  }

  return RPNEvaluator;
});
