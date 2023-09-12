// ==UserScript==
// @name         Funke Abwesenheitsmeldung
// @description  UI Verbesserungen für Funke Abwesenheitsmeldung
// @version      1
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        addStyle
// @grant        unsafeWindow

// @include      https://forms.office.com/pages/responsepage.aspx?id=B1LbIxNmmUuH7QmY_PnleBSX8XFz_RBGvWIH-2OKxrpUM1ZMUE1BQkY0STdTUERDMzRIWE1ENVk0Qi4u

// @downloadURL          http://localhost:3000/funke/abwesenheitsmeldung/main.js
// @updateURL            http://localhost:3000/funke/abwesenheitsmeldung/main.js

// @resource  css-common http://localhost:3000/common/styles.css
// @resource  css        http://localhost:3000/funke/abwesenheitsmeldung/styles.css

// @require         http://localhost:3000/common/head.js
// @require         http://localhost:3000/common/utility.js
// @require         http://localhost:3000/common/styles.js
// @require         http://localhost:3000/common/KeyHandler.js
// @require         http://localhost:3000/common/readout.js
// @require         http://localhost:3000/common/mutationHandler.js

// @require         http://localhost:3000/funke/abwesenheitsmeldung/UI.js

// ==/UserScript==


console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();