// ==UserScript==
// @name     SAP
// @version  1
// @description     Funke Self-Service
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_info
// @grant addStyle
// @grant unsafeWindow

// @include               https://dffsg026p43.funkemedien.de:20111/funke/nwbc/nwbc_cockpit/*
// @include               https://dffsg026p43.funkemedien.de:20111/funke/nwbc/nwbc_cockpit*


// @downloadURL           http://localhost:3000/funke/sap/main.js
// @updateURL             http://localhost:3000/funke/sap/main.js
// @resource  css-common  http://localhost:3000/common/styles.css
// @resource  css         http://localhost:3000/funke/sap/styles.css

// @require               http://localhost:3000/common/head.js
// @require               http://localhost:3000/common/styles.js
// @require               http://localhost:3000/common/KeyHandler.js
// @require               http://localhost:3000/common/readout.js
                          
// @require               http://localhost:3000/funke/sap/UI.js

// ==/UserScript==


console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();