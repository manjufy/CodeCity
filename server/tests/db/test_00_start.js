/**
 * @license
 * Code City: Testing code.
 *
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Mock up a basic console.
 * @author fraser@google.com (Neil Fraser)
 */

var console = {};
console.assert = function(value, message) {
  if (value) {
    console.goodCount++;
  } else {
    $.system.log('');
    $.system.log('Fail!');
    $.system.log(message);
    console.badCount++;
  }
};

// Counters for unit test results.
console.goodCount = 0;
console.badCount = 0;

var tests = {};