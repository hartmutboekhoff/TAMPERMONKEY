// ==UserScript==
// @name     Escenic Admin
// @version  1
// @description     Escenic Admin UI improvements
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_info
// @grant addStyle
// @grant unsafeWindow

// @include         https://publicationadmin.cloud.funkedigital.de/escenic-admin/*

// @downloadURL     http://localhost:3000/funke/escenic-admin/main.js
// @updateURL       http://localhost:3000/funke/escenic-admin/main.js
// @resource  css   http://localhost:3000/funke/escenic-admin/styles.css

// @require         http://localhost:3000/common/head.js
// @require         http://localhost:3000/common/styles.js
// @require         http://localhost:3000/common/KeyHandler.js
// @require         http://localhost:3000/common/readout.js

// @require         http://localhost:3000/funke/escenic-admin/automation.js

// ==/UserScript==


console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();