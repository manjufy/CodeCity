/**
 * @license
 * Copyright 2017 Google LLC
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
 * @fileoverview JavaScript Server Pages for Code City.
 * @author fraser@google.com (Neil Fraser)
 */

//////////////////////////////////////////////////////////////////////
// AUTO-GENERATED CODE FROM DUMP.  EDIT WITH CAUTION!
//////////////////////////////////////////////////////////////////////

$.Jssp = function Jssp(source) {
  /* Create a JavaScript Server Page.
   *
   * A JSSP is a function which takes two arguments - request and
   * response - and uses its own .source property as a template to
   * dynamically render HTML (or other text) into the response based
   * on the request.
   *
   * This constructor takes a source argument, which is used as the
   * initial value of the .source property of the JSSP, and returns
   * a Jssp object, which is itself a function.
   *
   * When the Jssp function object is called called, it will
   * automatically (re)compile .source if it has been modified since
   * last call, then call the compiled code.  This is done by a bit
   * of trickery: $.Jssp.prototype inherits from Function.prototype,
   * but $.Jssp.prototype.call overrides Function.call to implement
   * the automatic recompilation and delegation to the compiled code,
   * while the Jssp function objects themselves delegate to this
   * overridden call method.  (You can also use .apply and .bind as
   * usual.)
   */
  // Funny indentation here so it looks OK later.
  function jssp(request, response) {
  // DO NOT EDIT THIS CODE.  AUTOMATICALLY GENERATED BY JSSP.
  // To edit contents of generated page, edit this.source.
  return jssp.render(this, request, response);  // See $.Jssp for explanation.
};
  Object.setPrototypeOf(jssp, Object.getPrototypeOf(this));
  jssp.source = source;
  jssp.hash_ = undefined;
  jssp.compiled_ = undefined;
  return jssp;
};
Object.setOwnerOf($.Jssp, Object.getOwnerOf($.Selector.db.get));
Object.setPrototypeOf($.Jssp.prototype, Function.prototype);
$.Jssp.prototype.compile = function compile() {
  /* Compile a JavaScript Server Page.  Reads source from this.source,
   * sets this.compiled_ if successful.
   *
   * If you make changes to this function, consider incrementing
   * $.Jssp.prototype.compile.version, which will cause all Jssps to
   * be automatically recompiled using the new version.
   */
  var src = this.source;
  if (!src) {
    throw new ReferenceError('.source source property not found on JSSP');
  }
  var tokens = src.trim().split(/(<%(?:--|=)?|(?:--)?%>)/);
  var code = ["// DO NOT EDIT THIS CODE: AUTOMATICALLY GENERATED BY JSSP."];
  var STATES = {
    LITERAL: 0,
    STATEMENT: 1,
    EXPRESSION: 2,
    COMMENT: 3
  };
  var state = STATES.LITERAL;
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (!token) {
      continue;  // Empty string caused by splitting adjacent tags.
    }
    switch (state) {
      case STATES.LITERAL:
        if (token === '<%') {
          state = STATES.STATEMENT;
        } else if (token === '<%=') {
          state = STATES.EXPRESSION;
        } else if (token === '<%--') {
          state = STATES.COMMENT;
        } else {
          code.push('response.write(' + JSON.stringify(token) + ');');
        }
        break;
      case STATES.STATEMENT:
        if (token === '%>') {
          state = STATES.LITERAL;
        } else {
          code.push(token);
        }
        break;
      case STATES.EXPRESSION:
        if (token === '%>') {
          state = STATES.LITERAL;
        } else {
          token = token.trim();
          if (token) {
            code.push('response.write(' + token + ');');
          }
        }
        break;
      case STATES.COMMENT:
        if (token === '--%>') {
          state = STATES.LITERAL;
        }
        break;
    }
  }
  if (state !== STATES.LITERAL) {
    throw new SyntaxError('Unclosed JSSP tag.');
  }
  var code = '\n' + code.join('\n') + '\n';
  try {
    var newFunc = new Function('request, response', code);
  } catch (e) {
    $.system.log('JSSP compilation error.  ' + String(e) +
                 '.  Code was:\n' + code.split('\n')
                     .map(function (line, lineNumber) {
                            return String(lineNumber + 1) + ': ' + line;})
                     .join('\n'));
    throw e;
  }
  // Create name for this function.
  var selector = $.Selector.for(this);
  if (selector) {
    selector = new $.Selector(selector.concat('compiled_'));
    Object.defineProperty(newFunc, 'name', {value: selector.toString(), configurable: true});
  }

  this.compiled_ = newFunc;
  this.hash_ = $.utils.string.hash('md5', src) + compile.version;
};
Object.setOwnerOf($.Jssp.prototype.compile, Object.getOwnerOf($.Jssp));
Object.setOwnerOf($.Jssp.prototype.compile.prototype, Object.getOwnerOf($.Jssp.prototype.compile));
$.Jssp.prototype.compile.version = 'v1.0.0';
$.Jssp.prototype.toString = function toString(thisValue, request) {
  /* Invoke a Jssp but generate a string instead of writing to an HTTP
   * client.
   *
   * Args:
   * - thisValue: an object, to be supplied to the Jssp as this.
   * - request: a $.servers.http.Request (or a suitable mock, e.g.
   *   {user: <user>}) to be supplied as the request argument to the
   *   Jssp function when it is called.
   * Returns: a string containing the ouptut of the Jssp.
   */
  var response = new $.Jssp.OutputBuffer();
  this.call(thisValue, request || {}, response);
  return response.toString();
};
Object.setOwnerOf($.Jssp.prototype.toString, Object.getOwnerOf($.Jssp.prototype.compile.prototype));
Object.setOwnerOf($.Jssp.prototype.toString.prototype, Object.getOwnerOf($.Jssp.prototype.compile.prototype));
$.Jssp.prototype.render = function render(thisValue, request, response) {
  /* Call this Jssp function object, to render it.  The .source will
   * be recompiled automgically if necessary first.
   *
   * N.B. this method can and should be named .call, but @NeilFraser
   * believes you will be confused if Function.prototype.call is
   * overridden, even in the context of dyanmically autogenerated
   * code.
   *
   * Arguments:
   * - thisValue: the 'this' value to be supplied to the Jssp.
   * - request: a $.servers.http.Request (or mock), providing
   *     parameters (URL, etc.) for the Jssp.
   * - response: a $.servers.http.Response (or a mock with a .write
   *     method) to which the Jssp should write rendered output.
   *
   * Returns: whatever is returned by the compiled Jssp (probably
   *     undefined, since Jssps don't usually have any return
   *     statements.)
   */
  var hash = $.utils.string.hash('md5', this.source) + this.compile.version;
  if (hash !== this.hash_) this.compile();
  return this.compiled_.call(thisValue, request, response);
};
Object.setOwnerOf($.Jssp.prototype.render, Object.getOwnerOf($.Jssp.prototype.compile.prototype));
Object.setOwnerOf($.Jssp.prototype.render.prototype, Object.getOwnerOf($.Jssp.prototype.compile.prototype));
$.Jssp.OutputBuffer = function OutputBuffer() {
  /* An OutputBuffer is a mock $.servers.http.Response, used wheen we
   * want a Jssp to produce a string rather than write to an HTTP
   * client.
   */
  this.buffer_ = '';
};
Object.setOwnerOf($.Jssp.OutputBuffer, Object.getOwnerOf($.Jssp.prototype.compile.prototype));
$.Jssp.OutputBuffer.prototype.write = function(text) {
  this.buffer_ += text;
};
$.Jssp.OutputBuffer.prototype.toString = function() {
  return this.buffer_;
};

