// ==UserScript==
// @name         Funke Portale
// @version      6
// @namespace    http://hartmut-boekhoff.de
// @description  Printout Debug-Info for Funke News
// @author       Hartmut Boekhoff
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waz.de

// @match        https://www.waz.de
// @match        https://www.waz.de/*
// @match        https://www.nrz.de
// @match        https://www.nrz.de/*
// @match        https://www.wp.de
// @match        https://www.wp.de/*
// @match        https://www.wr.de
// @match        https://www.wr.de/*
// @match        https://www.ikz-online.de
// @match        https://www.ikz-online.de/*
// @match        https://www.morgenpost.de
// @match        https://www.morgenpost.de/*
// @match        https://www.abendblatt.de
// @match        https://www.abendblatt.de/*
// @match        https://www.thueringer-allgemeine.de
// @match        https://www.thueringer-allgemeine.de/*
// @match        https://www.otz.de
// @match        https://www.otz.de/*
// @match        https://www.tlz.de
// @match        https://www.tlz.de/*
// @match        https://www.braunschweiger-zeitung.de
// @match        https://www.braunschweiger-zeitung.de/*
// @match        https://www.harzkurier.de
// @match        https://www.harzkurier.de/*

// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        addStyle
// @grant        unsafeWindow

// @resource  css-common   http://localhost:3000/common/styles.css
// @resource  css          http://localhost:3000/funke/tz-portale/styles.css

// @require         http://localhost:3000/common/head.js
// @require         http://localhost:3000/common/utility.js
// @require         http://localhost:3000/common/styles.js
// @require         http://localhost:3000/common/KeyHandler.js
// @require         http://localhost:3000/common/readout.js

// @require         http://localhost:3000/funke/tz-portale/stats.js
// @require         http://localhost:3000/funke/tz-portale/info.js

// ==/UserScript==

console.log(GM_info.script.name, 'Version '+GM_info.script.version, 'Initialization complete');
console.groupEnd();