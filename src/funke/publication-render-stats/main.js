// ==UserScript==
// @name         Funke DebugInfo
// @version      5
// @namespace    http://hartmut-boekhoff.de
// @description  Printout Debug-Info for Funke News
// @author       Hartmut Boekhoff
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waz.de

// @match        https://www.waz.de/*?fw-debug=true&stats*
// @match        https://www.nrz.de/*?fw-debug=true&stats*
// @match        https://www.wp.de/*?fw-debug=true&stats*
// @match        https://www.wr.de/*?fw-debug=true&stats*
// @match        https://www.ikz-online.de/*?fw-debug=true&stats*
// @match        https://www.morgenpost.de/*?fw-debug=true&stats*
// @match        https://www.abendblatt.de/*?fw-debug=true&stats*
// @match        https://www.thueringer-allgemeine.de/*?fw-debug=true&stats*
// @match        https://www.otz.de/*?fw-debug=true&stats*
// @match        https://www.tlz.de/*?fw-debug=true&stats*
// @match        https://www.braunschweiger-zeitung.de/*?fw-debug=true&stats*
// @match        https://www.harzkurier.de/*?fw-debug=true&stats*



// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        addStyle
// @grant        unsafeWindow

// @resource  css   http://localhost:3000/funke/publication-render-stats/styles.css

// @require         http://localhost:3000/funke/publication-render-stats/styles.js
// @require         http://localhost:3000/funke/publication-render-stats/stats.js

// ==/UserScript==

console.log('HBo Tampermonkey', 'MAIN', 'Syntax Ok');
