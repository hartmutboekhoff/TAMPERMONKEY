// ==UserScript==
// @name     www.bahn.de
// @version  1
// @description     bahn.de UI improvements
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_info
// @grant addStyle
// @grant unsafeWindow

// @include         https://www.bahn.de/*

// @downloadURL          http://localhost:3000/hartmut/bahn.de/main.js
// @updateURL            http://localhost:3000/hartmut/bahn.de/main.js

// @resource  css-common http://localhost:3000/common/styles.css
// @resource  css        http://localhost:3000/hartmut/bahn.de/styles.css

// @require         http://localhost:3000/common/head.js
// @require         http://localhost:3000/common/styles.js
// @require         http://localhost:3000/common/KeyHandler.js
// @require         http://localhost:3000/common/readout.js

// @require         http://localhost:3000/hartmut/bahn.de/UI.js

// ==/UserScript==


console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();