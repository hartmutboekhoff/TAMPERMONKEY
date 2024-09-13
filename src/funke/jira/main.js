// ==UserScript==
// @name     JIRA
// @version  2
// @description     JIRA UI improvements
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_info
// @grant addStyle
// @grant unsafeWindow

// @include         https://sjira.funkemedien.de/*

// @downloadURL          http://localhost:3000/funke/jira/main.js
// @updateURL            http://localhost:3000/funke/jira/main.js
// @resource  css-common http://localhost:3000/common/styles.css
// @resource  css        http://localhost:3000/funke/jira/styles.css

// @require         http://localhost:3000/common/head.js
// @require         http://localhost:3000/common/styles.js
// @require         http://localhost:3000/common/KeyHandler.js
// @require         http://localhost:3000/common/readout.js
// @require         http://localhost:3000/common/mutationHandler.js

// @require         http://localhost:3000/funke/jira/UI.js
// @require         http://localhost:3000/funke/jira/automation.js

// ==/UserScript==


console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();