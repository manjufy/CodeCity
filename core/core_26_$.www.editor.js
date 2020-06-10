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
 * @fileoverview Code editor for Code City.
 * @author cpcallen@google.com (Christopher Allen)
 */

//////////////////////////////////////////////////////////////////////
// AUTO-GENERATED CODE FROM DUMP.  EDIT WITH CAUTION!
//////////////////////////////////////////////////////////////////////

$.www.editor = {};
$.www.editor.edit = function edit(obj, name, key) {
  /* Return a (valid) URL for a web editing session editing obj[key],
   * where obj might more commonly be known as name.
   */
  if (!$.utils.isObject(obj)) throw new TypeError('obj must be an object');
  if (typeof(key) !== 'string') throw new TypeError('key must be a string');

  var objId = $.db.tempId.storeObj(obj);
  var url = '/editor?objId=' + objId;
  if (name) {
    url += '&name=' + encodeURIComponent(name);
  }
  if (key) {
    url += '&key=' + encodeURIComponent(key);
  }
  return url;
};
Object.setOwnerOf($.www.editor.edit, Object.getOwnerOf($.Jssp.OutputBuffer));
$.www.editor.load = function load(obj, key) {
  /* Return string containing initial editor contents for editing
   * obj[key].
   */
  var pd = Object.getOwnPropertyDescriptor(obj, key);
  var value = pd ? pd.value : undefined;
  return $.utils.code.toSourceSafe(value);
};
Object.setOwnerOf($.www.editor.load, Object.getOwnerOf($.Jssp.OutputBuffer));
$.www.editor.save = function save(obj, key, src) {
  /* Eval the string src and (if successful) save the resulting value
   * as obj[key].  If the value produced from src and the existing
   * value of obj[key] are both objects, then an attempt will be made
   * to copy any properties from the old value to the new one.
   */
  var old = obj[key];
  src = $.utils.code.rewriteForEval(src, /* forceExpression= */ true);
  // Evaluate src in global scope (eval by any other name, literally).
  // TODO: don't use eval - prefer Function constructor for
  // functions; generate other values from an Acorn parse tree.
  var evalGlobal = eval;
  var val = evalGlobal(src);
  if (typeof old === 'function' && typeof val === 'function') {
    $.utils.object.transplantProperties(old, val);
  }
  if (typeof val === 'function') {
    val.lastModifiedTime = Date.now();
    // TODO: Add user.
    //val.lastModifiedUser = ...;
  }
  obj[key] = val;
  return this.load(obj, key);
};
Object.setOwnerOf($.www.editor.save, Object.getOwnerOf($.Jssp.OutputBuffer));
// CLOSURE: type: function, vars: source, jssp
// CLOSURE: type: funexp, vars: Jssp
$.www.editor.www = function jssp(request, response) {
  // DO NOT EDIT THIS CODE.  AUTOMATICALLY GENERATED BY JSSP.
  // To edit contents of generated page, edit this.source.
  return jssp.render(this, request, response);  // See $.Jssp for explanation.
};
Object.setPrototypeOf($.www.editor.www, $.Jssp.prototype);
Object.setOwnerOf($.www.editor.www, Object.getOwnerOf($.Jssp.OutputBuffer));
$.www.editor.www.source = '<%\nvar params = request.parameters;\nvar objId = params.objId;\nvar obj = $.db.tempId.getObjById(params.objId);\nif (!$.utils.isObject(obj)) {\n  // Bad edit URL.\n  $.www[\'404\'].www(request, response);\n  return;\n}\nvar key = params.key;\nvar src = params.src;\nvar status = \'\';\nif (src) {\n  try {\n    src = $.www.editor.save(obj, key, src);\n    status = \'(saved)\';\n    if (typeof obj[key] === \'function\') {\n      if (params.isVerb) {\n        obj[key].verb = params.verb;\n        obj[key].dobj = params.dobj;\n        obj[key].prep = params.prep;\n        obj[key].iobj = params.iobj;\n      } else {\n        delete obj[key].verb;\n        delete obj[key].dobj;\n        delete obj[key].prep;\n        delete obj[key].iobj;\n      }\n    }\n  } catch (e) {\n    status = \'(ERROR: \' + String(e) + \')\';\n  }\n} else {\n  src = $.www.editor.load(obj, key);\n}\nvar isVerb = (Object.getOwnPropertyDescriptor(obj, key) && typeof obj[key] === \'function\') && obj[key].verb ? \'checked\' : \'\';\nvar verb = $.utils.html.escape((obj[key] && obj[key].verb) || \'\');\nvar dobj = obj[key] && obj[key].dobj;\nvar prep = obj[key] && obj[key].prep;\nvar iobj = obj[key] && obj[key].iobj;\nvar name = $.utils.html.escape(params.name);\nkey = $.utils.html.escape(key);\nvar objOpts = [\'none\', \'this\', \'any\']\n%>\n<!DOCTYPE html>\n<html><head>\n  <title>Code Editor for <%= name %>.<%= key %></title>\n  <link href="/static/style/jfk.css" rel="stylesheet">\n  <style>\n    body {margin: 0; font-family: sans-serif}\n    h1 {margin-bottom: 5; font-size: small}\n    #submit {position: fixed; bottom: 1ex; right: 2ex; z-index: 9}\n    .CodeMirror {height: auto; border: 1px solid #eee}\n    #verb {width: 15ex}\n  </style>\n\n  <link rel="stylesheet" href="/static/CodeMirror/lib/codemirror.css">\n  <script src="/static/CodeMirror/lib/codemirror.js"></script>\n  <script src="/static/CodeMirror/mode/javascript/javascript.js"></script>\n</head><body>\n  <form action="/editor" method="post">\n  <button type="submit" class="jfk-button-submit" id="submit"\n    onclick="document.getElementById(\'src\').value = editor.getValue()">Save</button>\n  <h1>Editing <%= name %>.<%= key %>\n    <span id="status"><%= status %></span></h1>\n  <input name="objId" type="hidden" value="<%= $.utils.html.escape(objId) %>">\n  <input name="name" type="hidden" value="<%= name %>">\n  <input name="key" type="hidden" value="<%= key %>">\n  <div><input type="checkbox" name="isVerb" id="isVerb" <%= isVerb %> onclick="updateDisabled(); changed()">\n    <label for="isVerb">Verb:</label>\n    <input name="verb" id="verb" value="<%= verb %>" placeholder="name">\n    <select name="dobj" id="dobj" onchange="changed()">\n      <% for (var i = 0; i < objOpts.length; i++) {%>\n        <option <%= dobj === objOpts[i] ? \'selected\' : \'\' %>><%= objOpts[i] %></option>\n      <% } %>\n    </select>\n    <select name="prep" id="prep" onchange="changed()">\n      <% for (var i = 0; i < $.utils.command.prepositionOptions.length; i++) {%>\n        <option <%= prep === $.utils.command.prepositionOptions[i] ? \'selected\' : \'\' %>><%= $.utils.command.prepositionOptions[i] %></option>\n      <% } %>\n    </select>\n    <select name="iobj" id="iobj" onchange="changed()">\n      <% for (var i = 0; i < objOpts.length; i++) {%>\n        <option <%= iobj === objOpts[i] ? \'selected\' : \'\' %>><%= objOpts[i] %></option>\n      <% } %>\n    </select>\n  </div>\n  <textarea name="src" id="src"><%= $.utils.html.escape(src) %>\n</textarea>\n  </form>\n  <script>\n    var editor = CodeMirror.fromTextArea(document.getElementById(\'src\'), {\n      lineNumbers: true,\n      matchBrackets: true,\n      viewportMargin: Infinity,\n    });\n    editor.on(\'change\', changed);\n    function changed() {\n      document.getElementById(\'status\').innerText = \'(modified)\'\n    }\n    function updateDisabled() {\n      var disabled = document.getElementById(\'isVerb\').checked ? \'\' : \'disabled\';\n      document.getElementById(\'verb\').disabled = disabled;\n      document.getElementById(\'dobj\').disabled = disabled;\n      document.getElementById(\'prep\').disabled = disabled;\n      document.getElementById(\'iobj\').disabled = disabled;\n    }\n    updateDisabled();\n  </script>\n</body></html>';
$.www.editor.www.hash_ = '695b72042b87c58c1d60eba863f489c0v1.0.0';
$.www.editor.www.compiled_ = function(request, response) {
// DO NOT EDIT THIS CODE: AUTOMATICALLY GENERATED BY JSSP.

var params = request.parameters;
var objId = params.objId;
var obj = $.db.tempId.getObjById(params.objId);
if (!$.utils.isObject(obj)) {
  // Bad edit URL.
  $.www['404'].www(request, response);
  return;
}
var key = params.key;
var src = params.src;
var status = '';
if (src) {
  try {
    src = $.www.editor.save(obj, key, src);
    status = '(saved)';
    if (typeof obj[key] === 'function') {
      if (params.isVerb) {
        obj[key].verb = params.verb;
        obj[key].dobj = params.dobj;
        obj[key].prep = params.prep;
        obj[key].iobj = params.iobj;
      } else {
        delete obj[key].verb;
        delete obj[key].dobj;
        delete obj[key].prep;
        delete obj[key].iobj;
      }
    }
  } catch (e) {
    status = '(ERROR: ' + String(e) + ')';
  }
} else {
  src = $.www.editor.load(obj, key);
}
var isVerb = (Object.getOwnPropertyDescriptor(obj, key) && typeof obj[key] === 'function') && obj[key].verb ? 'checked' : '';
var verb = $.utils.html.escape((obj[key] && obj[key].verb) || '');
var dobj = obj[key] && obj[key].dobj;
var prep = obj[key] && obj[key].prep;
var iobj = obj[key] && obj[key].iobj;
var name = $.utils.html.escape(params.name);
key = $.utils.html.escape(key);
var objOpts = ['none', 'this', 'any']

response.write("\n<!DOCTYPE html>\n<html><head>\n  <title>Code Editor for ");
response.write(name);
response.write(".");
response.write(key);
response.write("</title>\n  <link href=\"/static/style/jfk.css\" rel=\"stylesheet\">\n  <style>\n    body {margin: 0; font-family: sans-serif}\n    h1 {margin-bottom: 5; font-size: small}\n    #submit {position: fixed; bottom: 1ex; right: 2ex; z-index: 9}\n    .CodeMirror {height: auto; border: 1px solid #eee}\n    #verb {width: 15ex}\n  </style>\n\n  <link rel=\"stylesheet\" href=\"/static/CodeMirror/lib/codemirror.css\">\n  <script src=\"/static/CodeMirror/lib/codemirror.js\"></script>\n  <script src=\"/static/CodeMirror/mode/javascript/javascript.js\"></script>\n</head><body>\n  <form action=\"/editor\" method=\"post\">\n  <button type=\"submit\" class=\"jfk-button-submit\" id=\"submit\"\n    onclick=\"document.getElementById('src').value = editor.getValue()\">Save</button>\n  <h1>Editing ");
response.write(name);
response.write(".");
response.write(key);
response.write("\n    <span id=\"status\">");
response.write(status);
response.write("</span></h1>\n  <input name=\"objId\" type=\"hidden\" value=\"");
response.write($.utils.html.escape(objId));
response.write("\">\n  <input name=\"name\" type=\"hidden\" value=\"");
response.write(name);
response.write("\">\n  <input name=\"key\" type=\"hidden\" value=\"");
response.write(key);
response.write("\">\n  <div><input type=\"checkbox\" name=\"isVerb\" id=\"isVerb\" ");
response.write(isVerb);
response.write(" onclick=\"updateDisabled(); changed()\">\n    <label for=\"isVerb\">Verb:</label>\n    <input name=\"verb\" id=\"verb\" value=\"");
response.write(verb);
response.write("\" placeholder=\"name\">\n    <select name=\"dobj\" id=\"dobj\" onchange=\"changed()\">\n      ");
 for (var i = 0; i < objOpts.length; i++) {
response.write("\n        <option ");
response.write(dobj === objOpts[i] ? 'selected' : '');
response.write(">");
response.write(objOpts[i]);
response.write("</option>\n      ");
 } 
response.write("\n    </select>\n    <select name=\"prep\" id=\"prep\" onchange=\"changed()\">\n      ");
 for (var i = 0; i < $.utils.command.prepositionOptions.length; i++) {
response.write("\n        <option ");
response.write(prep === $.utils.command.prepositionOptions[i] ? 'selected' : '');
response.write(">");
response.write($.utils.command.prepositionOptions[i]);
response.write("</option>\n      ");
 } 
response.write("\n    </select>\n    <select name=\"iobj\" id=\"iobj\" onchange=\"changed()\">\n      ");
 for (var i = 0; i < objOpts.length; i++) {
response.write("\n        <option ");
response.write(iobj === objOpts[i] ? 'selected' : '');
response.write(">");
response.write(objOpts[i]);
response.write("</option>\n      ");
 } 
response.write("\n    </select>\n  </div>\n  <textarea name=\"src\" id=\"src\">");
response.write($.utils.html.escape(src));
response.write("\n</textarea>\n  </form>\n  <script>\n    var editor = CodeMirror.fromTextArea(document.getElementById('src'), {\n      lineNumbers: true,\n      matchBrackets: true,\n      viewportMargin: Infinity,\n    });\n    editor.on('change', changed);\n    function changed() {\n      document.getElementById('status').innerText = '(modified)'\n    }\n    function updateDisabled() {\n      var disabled = document.getElementById('isVerb').checked ? '' : 'disabled';\n      document.getElementById('verb').disabled = disabled;\n      document.getElementById('dobj').disabled = disabled;\n      document.getElementById('prep').disabled = disabled;\n      document.getElementById('iobj').disabled = disabled;\n    }\n    updateDisabled();\n  </script>\n</body></html>");
};
Object.setOwnerOf($.www.editor.www.compiled_, Object.getOwnerOf($.Jssp.OutputBuffer));
Object.setOwnerOf($.www.editor.www.compiled_.prototype, Object.getOwnerOf($.Jssp.OutputBuffer));
Object.defineProperty($.www.editor.www.compiled_, 'name', {value: '$.www.editor.www.compiled_'});
$.www.editor.www.jssp = '<%\nvar params = request.parameters;\nvar objId = params.objId;\nvar obj = $.db.tempId.getObjById(params.objId);\nif (!$.utils.isObject(obj)) {\n  // Bad edit URL.\n  $.www[\'404\'].www(request, response);\n  return;\n}\nvar key = params.key;\nvar src = params.src;\nvar status = \'\';\nif (src) {\n  try {\n    src = $.www.editor.save(obj, key, src);\n    status = \'(saved)\';\n    if (typeof obj[key] === \'function\') {\n      if (params.isVerb) {\n        obj[key].verb = params.verb;\n        obj[key].dobj = params.dobj;\n        obj[key].prep = params.prep;\n        obj[key].iobj = params.iobj;\n      } else {\n        delete obj[key].verb;\n        delete obj[key].dobj;\n        delete obj[key].prep;\n        delete obj[key].iobj;\n      }\n    }\n  } catch (e) {\n    status = \'(ERROR: \' + String(e) + \')\';\n  }\n} else {\n  src = $.www.editor.load(obj, key);\n}\nvar isVerb = (Object.getOwnPropertyDescriptor(obj, key) && typeof obj[key] === \'function\') && obj[key].verb ? \'checked\' : \'\';\nvar verb = $.utils.html.escape((obj[key] && obj[key].verb) || \'\');\nvar dobj = obj[key] && obj[key].dobj;\nvar prep = obj[key] && obj[key].prep;\nvar iobj = obj[key] && obj[key].iobj;\nvar name = $.utils.html.escape(params.name);\nkey = $.utils.html.escape(key);\nvar objOpts = [\'none\', \'this\', \'any\']\n%>\n<!DOCTYPE html>\n<html><head>\n  <title>Code Editor for <%= name %>.<%= key %></title>\n  <link href="/static/style/jfk.css" rel="stylesheet">\n  <style>\n    body {margin: 0; font-family: sans-serif}\n    h1 {margin-bottom: 5; font-size: small}\n    #submit {position: fixed; bottom: 1ex; right: 2ex; z-index: 9}\n    .CodeMirror {height: auto; border: 1px solid #eee}\n    #verb {width: 15ex}\n  </style>\n\n  <link rel="stylesheet" href="/static/CodeMirror/lib/codemirror.css">\n  <script src="/static/CodeMirror/lib/codemirror.js"></script>\n  <script src="/static/CodeMirror/mode/javascript/javascript.js"></script>\n</head><body>\n  <form action="/editor" method="post">\n  <button type="submit" class="jfk-button-submit" id="submit"\n    onclick="document.getElementById(\'src\').value = editor.getValue()">Save</button>\n  <h1>Editing <%= name %>.<%= key %>\n    <span id="status"><%= status %></span></h1>\n  <input name="objId" type="hidden" value="<%= $.utils.html.escape(objId) %>">\n  <input name="name" type="hidden" value="<%= name %>">\n  <input name="key" type="hidden" value="<%= key %>">\n  <div><input type="checkbox" name="isVerb" id="isVerb" <%= isVerb %> onclick="updateDisabled(); changed()">\n    <label for="isVerb">Verb:</label>\n    <input name="verb" id="verb" value="<%= verb %>" placeholder="name">\n    <select name="dobj" id="dobj" onchange="changed()">\n      <% for (var i = 0; i < objOpts.length; i++) {%>\n        <option <%= dobj === objOpts[i] ? \'selected\' : \'\' %>><%= objOpts[i] %></option>\n      <% } %>\n    </select>\n    <select name="prep" id="prep" onchange="changed()">\n      <% for (var i = 0; i < $.utils.command.prepositionOptions.length; i++) {%>\n        <option <%= prep === $.utils.command.prepositionOptions[i] ? \'selected\' : \'\' %>><%= $.utils.command.prepositionOptions[i] %></option>\n      <% } %>\n    </select>\n    <select name="iobj" id="iobj" onchange="changed()">\n      <% for (var i = 0; i < objOpts.length; i++) {%>\n        <option <%= iobj === objOpts[i] ? \'selected\' : \'\' %>><%= objOpts[i] %></option>\n      <% } %>\n    </select>\n  </div>\n  <textarea name="src" id="src"><%= $.utils.html.escape(src) %>\n</textarea>\n  </form>\n  <script>\n    var editor = CodeMirror.fromTextArea(document.getElementById(\'src\'), {\n      lineNumbers: true,\n      matchBrackets: true,\n      viewportMargin: Infinity,\n    });\n    editor.on(\'change\', changed);\n    function changed() {\n      document.getElementById(\'status\').innerText = \'(modified)\'\n    }\n    function updateDisabled() {\n      var disabled = document.getElementById(\'isVerb\').checked ? \'\' : \'disabled\';\n      document.getElementById(\'verb\').disabled = disabled;\n      document.getElementById(\'dobj\').disabled = disabled;\n      document.getElementById(\'prep\').disabled = disabled;\n      document.getElementById(\'iobj\').disabled = disabled;\n    }\n    updateDisabled();\n  </script>\n</body></html>';

$.www['/editor'] = $.www.editor;

