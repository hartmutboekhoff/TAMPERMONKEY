// ==UserScript==
// @name     Helpdesk UI
// @description     Helpdesk UI
// @version  1
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant addStyle
// @include https://helpline.funkemedien.de/ServicewareProcesses/processes
// @include https://helpline.funkemedien.de/WebDesk/WebForms/*
// @require   http://localhost:3000/greasemonkey/KeyHandler.js
// @resource css http://localhost:3000/greasemonkey/styles.css
// ==/UserScript==
const version = '1.0';
console.log('greasemonkey', 'start', 'Version '+version);

//----
(function addStyle(css) {
  const s = document.createElement('style');
  s.innerHTML = css;
  s.id = "hartmut-style"
  document.head.appendChild(s);
})(GM_getResourceText('css'));

