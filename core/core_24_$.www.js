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
 * @fileoverview Top-level URL handlers for Code City.
 * @author fraser@google.com (Neil Fraser)
 */

//////////////////////////////////////////////////////////////////////
// AUTO-GENERATED CODE FROM DUMP.  EDIT WITH CAUTION!
//////////////////////////////////////////////////////////////////////

$.www = {};

$.www[404] = {};
// CLOSURE: type: function, vars: source, jssp
// CLOSURE: type: funexp, vars: Jssp
$.www[404].www = function jssp(request, response) {
  // DO NOT EDIT THIS CODE.  AUTOMATICALLY GENERATED BY JSSP.
  // To edit contents of generated page, edit this.source.
  return jssp.render(this, request, response);  // See $.Jssp for explanation.
};
Object.setPrototypeOf($.www[404].www, $.Jssp.prototype);
Object.setOwnerOf($.www[404].www, Object.getOwnerOf($.Jssp.OutputBuffer));
$.www[404].www.source = '<% response.statusCode = 404 %>\n<html>\n<head>\n  <title>404 - Code City</title>\n  <style>\n    body {\n      font-family: "Roboto Mono", monospace;\n      text-align: center;\n    }\n    h1 {\n      font-size: 40pt;\n      font-weight: 100;\n    }\n    h1>img {\n      vertical-align: text-bottom;\n    }\n    pre {\n      margin: 2em;\n    }\n  </style>\n  <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet">\n  <link href="/static/favicon.ico" rel="shortcut icon">\n</head>\n<body>\n  <h1>\n    <img src="/static/logo-error.svg" alt="">\n    404 Page Not Found\n  </h1>\n  <pre><%= request.method %> <%= $.utils.html.escape(request.url) %></pre>\n</body>\n</html>';
$.www[404].www.hash_ = '6b5afde89f78a24e4f18c91c20144badv1.0.0';
$.www[404].www.compiled_ = function(request, response) {
// DO NOT EDIT THIS CODE: AUTOMATICALLY GENERATED BY JSSP.
 response.statusCode = 404 
response.write("\n<html>\n<head>\n  <title>404 - Code City</title>\n  <style>\n    body {\n      font-family: \"Roboto Mono\", monospace;\n      text-align: center;\n    }\n    h1 {\n      font-size: 40pt;\n      font-weight: 100;\n    }\n    h1>img {\n      vertical-align: text-bottom;\n    }\n    pre {\n      margin: 2em;\n    }\n  </style>\n  <link href=\"https://fonts.googleapis.com/css?family=Roboto+Mono\" rel=\"stylesheet\">\n  <link href=\"/static/favicon.ico\" rel=\"shortcut icon\">\n</head>\n<body>\n  <h1>\n    <img src=\"/static/logo-error.svg\" alt=\"\">\n    404 Page Not Found\n  </h1>\n  <pre>");
response.write(request.method);
response.write(" ");
response.write($.utils.html.escape(request.url));
response.write("</pre>\n</body>\n</html>");
};
Object.setOwnerOf($.www[404].www.compiled_, Object.getOwnerOf($.Jssp.OutputBuffer));
Object.setOwnerOf($.www[404].www.compiled_.prototype, Object.getOwnerOf($.Jssp.OutputBuffer));
Object.defineProperty($.www[404].www.compiled_, 'name', {value: '$.www[404].www.compiled_'});
$.www[404].www.jssp = '<% response.statusCode = 404 %>\n<html>\n<head>\n  <title>404 - Code City</title>\n  <style>\n    body {\n      font-family: "Roboto Mono", monospace;\n      text-align: center;\n    }\n    h1 {\n      font-size: 40pt;\n      font-weight: 100;\n    }\n    h1>img {\n      vertical-align: text-bottom;\n    }\n    pre {\n      margin: 2em;\n    }\n  </style>\n  <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet">\n  <link href="/static/favicon.ico" rel="shortcut icon">\n</head>\n<body>\n  <h1>\n    <img src="/static/logo-error.svg" alt="">\n    404 Page Not Found\n  </h1>\n  <pre><%= request.method %> <%= $.utils.html.escape(request.url) %></pre>\n</body>\n</html>';

$.www['/'] = {};
// CLOSURE: type: function, vars: source, jssp
// CLOSURE: type: funexp, vars: Jssp
$.www['/'].www = function jssp(request, response) {
  // DO NOT EDIT THIS CODE.  AUTOMATICALLY GENERATED BY JSSP.
  // To edit contents of generated page, edit this.source.
  return jssp.render(this, request, response);  // See $.Jssp for explanation.
};
Object.setPrototypeOf($.www['/'].www, $.Jssp.prototype);
Object.setOwnerOf($.www['/'].www, Object.getOwnerOf($.Jssp.OutputBuffer));
Object.setOwnerOf($.www['/'].www.prototype, Object.getOwnerOf($.Jssp.OutputBuffer));
$.www['/'].www.source = '<!doctype html>\n<html lang="en">\n<head>\n  <title>Code City</title>\n  <style>\n    body {\n      font-family: "Roboto Mono", monospace;\n      text-align: center;\n    }\n    h1 {\n      font-size: 40pt;\n      font-weight: 100;\n    }\n    h1>img {\n      vertical-align: text-bottom;\n    }\n    #tagline {\n      font-style: italic;\n      margin: 2em;\n    }\n    iframe {\n      height: 50px;\n      width: 100px;\n      border: none;\n      display: block;\n      margin: 0 auto;\n    }\n  </style>\n  <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet">\n  <link href="/static/favicon.ico" rel="shortcut icon">\n</head>\n<body>\n  <h1>\n    <img src="/static/logo.svg" alt="" width="95px" height="100px">\n    Code City\n  </h1>\n  <p id="tagline">A community of inquisitive programmers.</p>\n  <iframe src="/login"></iframe>\n</body>\n</html>';
$.www['/'].www.hash_ = '510e3a6d25c8cda743d74659fcb42b61v1.0.0';
$.www['/'].www.compiled_ = function(request, response) {
// DO NOT EDIT THIS CODE: AUTOMATICALLY GENERATED BY JSSP.
response.write("<!doctype html>\n<html lang=\"en\">\n<head>\n  <title>Code City</title>\n  <style>\n    body {\n      font-family: \"Roboto Mono\", monospace;\n      text-align: center;\n    }\n    h1 {\n      font-size: 40pt;\n      font-weight: 100;\n    }\n    h1>img {\n      vertical-align: text-bottom;\n    }\n    #tagline {\n      font-style: italic;\n      margin: 2em;\n    }\n    iframe {\n      height: 50px;\n      width: 100px;\n      border: none;\n      display: block;\n      margin: 0 auto;\n    }\n  </style>\n  <link href=\"https://fonts.googleapis.com/css?family=Roboto+Mono\" rel=\"stylesheet\">\n  <link href=\"/static/favicon.ico\" rel=\"shortcut icon\">\n</head>\n<body>\n  <h1>\n    <img src=\"/static/logo.svg\" alt=\"\" width=\"95px\" height=\"100px\">\n    Code City\n  </h1>\n  <p id=\"tagline\">A community of inquisitive programmers.</p>\n  <iframe src=\"/login\"></iframe>\n</body>\n</html>");
};
Object.setOwnerOf($.www['/'].www.compiled_, Object.getOwnerOf($.Jssp.OutputBuffer));
Object.setOwnerOf($.www['/'].www.compiled_.prototype, Object.getOwnerOf($.Jssp.OutputBuffer));
Object.defineProperty($.www['/'].www.compiled_, 'name', {value: '$.www.homepage.www.compiled_'});

$.www['/robots.txt'] = {};
// CLOSURE: type: function, vars: source, jssp
// CLOSURE: type: funexp, vars: Jssp
$.www['/robots.txt'].www = function jssp(request, response) {
  // DO NOT EDIT THIS CODE.  AUTOMATICALLY GENERATED BY JSSP.
  // To edit contents of generated page, edit this.source.
  return jssp.render(this, request, response);  // See $.Jssp for explanation.
};
Object.setPrototypeOf($.www['/robots.txt'].www, $.Jssp.prototype);
Object.setOwnerOf($.www['/robots.txt'].www, Object.getOwnerOf($.Jssp.OutputBuffer));
Object.setOwnerOf($.www['/robots.txt'].www.prototype, Object.getOwnerOf($.Jssp.OutputBuffer));
$.www['/robots.txt'].www.source = "<% response.setHeader('Content-Type', 'text/plain; charset=utf-8') %>\n# Don't index this Code City instance at this time.\nUser-agent: *\nDisallow: /";
$.www['/robots.txt'].www.hash_ = '93d21ff90a36d1fb6bcf5d7cb4f5add3v1.0.0';
$.www['/robots.txt'].www.compiled_ = function(request, response) {
// DO NOT EDIT THIS CODE: AUTOMATICALLY GENERATED BY JSSP.
 response.setHeader('Content-Type', 'text/plain; charset=utf-8') 
response.write("\n# Don't index this Code City instance at this time.\nUser-agent: *\nDisallow: /");
};
delete $.www['/robots.txt'].www.compiled_.name;
Object.setOwnerOf($.www['/robots.txt'].www.compiled_, Object.getOwnerOf($.Jssp.OutputBuffer));
Object.setOwnerOf($.www['/robots.txt'].www.compiled_.prototype, Object.getOwnerOf($.Jssp.OutputBuffer));

