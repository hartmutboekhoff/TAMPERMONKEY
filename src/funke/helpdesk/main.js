// ==UserScript==
// @name     Helpdesk UI
// @version  9
// @description     Helpdesk UI
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_info
// @grant addStyle
// @grant unsafeWindow
// @include         https://helpline.funkemedien.de/ServicewareProcesses/processes
// @include         https://helpline.funkemedien.de/WebDesk/WebForms/*
// @include         https://helpline.funkemedien.de/WebDesk/*
// @include         https://helpline.funkemedien.de/ServicewareProcesses/tasks
// @include         https://helpline.funkemedien.de/WebDesk/Task/TaskDialog
// @include         https://helpline.funkemedien.de/WebDesk/Task/TaskDialog?*
// @include         https://helpline.funkemedien.de/auth/*

// @downloadURL            http://localhost:3000/funke/helpdesk/main.js
// @updateURL              http://localhost:3000/funke/helpdesk/main.js
// @resource  css-common   http://localhost:3000/common/styles.css
// @resource  css          http://localhost:3000/funke/helpdesk/styles.css

// @require         http://localhost:3000/common/head.js
// @require         http://localhost:3000/common/styles.js
// @require         http://localhost:3000/common/KeyHandler.js
// @require         http://localhost:3000/common/readout.js
// @require         http://localhost:3000/common/mutationHandler.js

// @require         http://localhost:3000/funke/helpdesk/UI.js

// ==/UserScript==


console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();