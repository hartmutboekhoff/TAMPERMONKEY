// ==UserScript==
// @name     Helpdesk UI
// @version  7
// @description     Helpdesk UI
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_info
// @grant addStyle
// @grant unsafeWindow
// @include https://helpline.funkemedien.de/ServicewareProcesses/processes
// @include https://helpline.funkemedien.de/WebDesk/WebForms/*
// @downloadURL  http://localhost:3000/greasemonkey/helpdeskUI.js
// @updateURL  http://localhost:3000/greasemonkey/helpdeskUI.js
// @require  http://localhost:3000/greasemonkey/helpdeskUI-main.js
// @require   http://localhost:3000/greasemonkey/KeyHandler.js
// @require   http://localhost:3000/greasemonkey/shortcut-keys.js
// @resource css http://localhost:3000/greasemonkey/styles.css
// ==/UserScript==

console.log('initialized', 'Version '+GM_info.script.version);

console.groupEnd();