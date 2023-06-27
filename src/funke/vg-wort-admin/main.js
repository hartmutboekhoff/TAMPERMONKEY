// ==UserScript==
// @name     Funke VG-Wort Admin
// @version  1
// @description     Funke VG-Wort Admin
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_info
// @grant addStyle
// @grant unsafeWindow

// @include               https://appboard.cloud.funkedigital.de/app-board/



// @downloadURL           http://localhost:3000/funke/vg-wort-admin/main.js
// @updateURL             http://localhost:3000/funke/vg-wort-admin/main.js
// @resource  css-common  http://localhost:3000/common/styles.css
// @resource  css         http://localhost:3000/funke/vg-wort-admin/styles.css

// @require               http://localhost:3000/common/head.js
// @require               http://localhost:3000/common/styles.js
// @require               http://localhost:3000/common/KeyHandler.js
// @require               http://localhost:3000/common/readout.js
                          
// @require               http://localhost:3000/funke/vg-wort-admin/UI.js

// ==/UserScript==


console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();