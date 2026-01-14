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

/* eslint-disable capitalized-comments */
/* eslint-disable jsdoc/check-alignment */

/**
 * This is a simple Javascript Stack Class based off an Array.
 *
 * @module      block_calculator/stack
 * @copyright   2024 Leon Berau <leon.berau@ruhr-uni-bochum.de>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define([], function() {
  /**
    * Stack
    * Simple Stack Class.
    */
  class Stack {
    /**
    * constructor
    * Create the Stack.
    */
    constructor() {
      // Initialize the Stack Array.
      this.stack = [];
    }

    /**
    * push
    * Push a value into the stack.
    * @param {string} number
    */
    push(number) {
      // Push the value into the stack Array.
      this.stack.push(number);
    }

    /**
    * pop
    * Pop the top Element from the Stack.
    */
    pop() {
      // Should the Stack be Empty return null
      if (this.stack.length === 0) {
        return null;
      }
      // Return the popped Element and execute pop.
      return this.stack.pop();
    }

    /**
    * peek
    * See the Element at the top.
    */
    peek() {
      return this.stack.at(-1);
    }

    /**
    * shift
    * Remove a Element from the left.
    */
    shift() {
      return this.stack.shift();
    }

    /**
    * isEmpty
    * Returns a bool if the Stack has no entries.
    */

    isEmpty() {
      return this.stack.length === 0;
    }

    /**
    * size
    * Get the Stack size.
    */
    size() {
      return this.stack.length;
    }
  }
  // Return the Stack class.
  return Stack;
});
