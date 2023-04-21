// ==UserScript==
// @name     Helpdesk UI
// @version  8
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

// @downloadURL     http://localhost:3000/greasemonkey/helpdeskUI.js
// @updateURL       http://localhost:3000/greasemonkey/helpdeskUI.js
// @resource  css   http://localhost:3000/greasemonkey/helpdeskUI.css

// @require         http://localhost:3000/greasemonkey/head.js
// @require         http://localhost:3000/greasemonkey/styles.js
// @require         http://localhost:3000/greasemonkey/KeyHandler.js
// @require         http://localhost:3000/greasemonkey/readout.js
// @require         http://localhost:3000/greasemonkey/mutationHandler.js

// ==/UserScript==

console.log('greasemonkey is working');
window.addEventListener('load',()=>{
  console.group('greasemonkey')
  
  // ================================================
  console.log('initializing shortcut-keys');
  
  
  
  // ================================================
  console.log('initializing read-out elements');
  window.registerForReadOut('.labelSubject');
  window.registerForReadOut('#ComplexTextDescription',{exclude:'div.helpLineComplexTextLabel>table'});
  window.registerForReadOut('.tabControlHeader span');
  window.registerForReadOut('div.jqx-grid-cell.jqx-item');
  window.registerForReadOut('div#contenttableHLGrid>div');
  window.registerForReadOut('div.jqx-grid-group-cell');
  window.registerForReadOut('mat-cell.mat-cell.mat-cell-data');
  window.registerForReadOut('textarea#vm\\.Sys\\.Description');
  window.registerForReadOut('input#vm\\.Sys\\.Subject');
  window.registerForReadOut('div.activitylog > div.activitylog-row',{exclude:'.activitylog-activity-changes,.activitylog-activity-propertyChanges,.activitylog-activity-header,label,span.comment-title'});
  window.registerForReadOut('div.activitylog > div.activitylog-row > div',{exclude:'.activitylog-activity-changes,.activitylog-activity-propertyChanges,label'});
  window.registerForReadOut('#GroupBoxActivityDescription',{exclude:'#GroupBoxActivityDescription>span'});
  window.registerForReadOut('#SUControlEDITOR>div>div',{exclude:'#PanelContentSUControlEDITOR2 span:nth-child(-n+1)'});

  // ================================================
  console.log('initializing mutation-reactions');
  window.onMutation({
    selector: 'MAT-ROW.mat-row',
    filter: e=>{
        return !!e.innerText.match(/escenic/i)?.[0]
               && !!e.innerText.match(/austritt|freistellung/i)?.[0];
      },
    className: 'esc-delete-account',
  });
  


  
  // ================================================
  console.log('onLoad() finished successfully');
  console.groupEnd();
});

console.log('initialized', 'Version '+GM_info.script.version);
console.groupEnd();