// ==UserScript==
// @name     Escenic User-Upload
// @version  1
// @description     User-Upload UI improvements
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_info
// @grant addStyle
// @grant unsafeWindow

// @include         https://esc-pub-tools.cloud.funkedigital.de/esc-pub-tools/servlets/user-excel-importer/
// @include         https://esc-pub-tools-uat.cloud.funkedigital.de/esc-pub-tools/servlets/user-excel-importer/

// @downloadURL          http://localhost:3000/funke/escenic-user-upload/main.js
// @updateURL            http://localhost:3000/funke/escenic-user-upload/main.js
// @resource  css-common http://localhost:3000/common/styles.css
// @resource  css        http://localhost:3000/funke/escenic-user-upload/styles.css

// @require         http://localhost:3000/common/head.js
// @require         http://localhost:3000/common/styles.js

// @require         http://localhost:3000/funke/escenic-user-upload/UI.js

// ==/UserScript==


console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();