// ==UserScript==
// @name         Vorlage
// @description  UI Verbesserungen für Vorlage
// @version      1
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        addStyle
// @grant        unsafeWindow

// @include      https://www.vorlage.de/*

// @downloadURL          http://localhost:3000/...vorlage.../main.js
// @updateURL            http://localhost:3000/...vorlage.../main.js

// @resource  css-common http://localhost:3000/common/styles.css
// @resource  css        http://localhost:3000/...vorlage.../styles.css

// @require         http://localhost:3000/common/head.js
// @require         http://localhost:3000/common/styles.js
// @require         http://localhost:3000/common/KeyHandler.js
// @require         http://localhost:3000/common/readout.js

// @require         http://localhost:3000/...vorlage.../UI.js

// ==/UserScript==


console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();