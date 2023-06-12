// ==UserScript==
// @name     VG-Wort Metis
// @version  1
// @description     VG-Wort Metis
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_info
// @grant addStyle
// @grant unsafeWindow

// @include               https://tom.vgwort.de/*



// @downloadURL           http://localhost:3000/funke/vg-wort-metis/main.js
// @updateURL             http://localhost:3000/funke/vg-wort-metis/main.js
// @resource  css-common  http://localhost:3000/common/styles.css
// @resource  css         http://localhost:3000/funke/vg-wort-metis/styles.css

// @require               http://localhost:3000/common/head.js
// @require               http://localhost:3000/common/styles.js
// @require               http://localhost:3000/common/KeyHandler.js
// @require               http://localhost:3000/common/readout.js
                          
// @require               http://localhost:3000/funke/vg-wort-metis/UI.js

// ==/UserScript==


console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();