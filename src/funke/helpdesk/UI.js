window.addEventListener('load',()=>{
  console.group('greasemonkey')
  
  // ================================================
  console.log('initializing shortcut-keys');
  
  
  
  // ================================================
  console.log('initializing read-out elements');
  
  const issueKeyToDate = {
    pattern: /(?:\[#)?(\d{4})(\d{2})(\d{2})-(\d{4})\]?/,
    replacement: 'vom $3.$2.$1, Nr. $4',
  };
  
  window.registerForReadOut('.labelSubject');
  window.registerForReadOut('#ComplexTextDescription',{exclude:'textarea,div.helpLineComplexTextLabel>table'});
  window.registerForReadOut('.tabControlHeader span');
  // Zeile im Reiter f�r reservierte Aufgaben.
  window.registerForReadOut('div.jqx-grid-cell.jqx-item'
                            //,{ replace: issueKeyToDate }
                           );
  window.registerForReadOut('div#contenttableHLGrid>div');
  // Process-Liste
  window.registerForReadOut('div.jqx-grid-group-cell',
                            {replace: issueKeyToDate}
                           );
  window.registerForReadOut('mat-cell.mat-cell.mat-cell-data');
  window.registerForReadOut('textarea#vm\\.Sys\\.Description');
  window.registerForReadOut('input#vm\\.Sys\\.Subject');
  
  window.registerForReadOut('div.activitylog > div.activitylog-row',
                            {exclude:'.activitylog-activity-changes,.activitylog-activity-propertyChanges,.activitylog-activity-header,label,span.comment-title'}
                           );
  window.registerForReadOut('div.activitylog > div.activitylog-row > div',
                            {exclude:'.activitylog-activity-changes,.activitylog-activity-propertyChanges,label'}
                           );
  window.registerForReadOut('#GroupBoxActivityDescription',
                            {exclude:'#GroupBoxActivityDescription>span,#GroupBoxSUAttachment'}
                           );
  // Activity-Log
  window.registerForReadOut('#SUControlEDITOR>div>div',
                            {
                              //exclude:'#PanelContentSUControlEDITOR2 span:nth-child(-n+1)',
                              childElements: {
                                '[id^="PanelHeaderSUControlEDITOR"]': {
                                  extract: node=>node.innerText.replace(/SU (\d+) \(Editor: (.*?)\)/,'Nummer $1 von $2'),
                                },
                                '[id^="PanelContentSUControlEDITOR"]': {
                                  extract: node=>node.querySelector('.SUControlItemValue')?.innerText,
                                },
                              }
                            }
                           );

  window.registerForReadOut('#DateTimeControlREGISTRATIONTIMEcalendarTB');
  window.registerForReadOut('a.hyperLinkObjectId span.labelObjectId, input#tbTextBoxBezugsnummermitTag',
                            { replace: issueKeyToDate}
                           );


  // ================================================
  //  Umlaute werden wie folgt codiert:
  //     �: \xc4
  //     �: \xd6
  //     �: \xdc
  //     �: \xe4
  //     �: \xf6
  //     �: \xfc
  //     �: \xdf

  console.log('initializing mutation-reactions');
  window.onMutation([
    {
      selector: 'MAT-ROW.mat-row',
      callback: e=>{
          if( !!e.innerText.match(/escenic/i)?.[0] ) {
            if( !!e.innerText.match(/l\xf6sch|austritt|freistellung/i)?.[0] )
              e.classList.add('esc-delete-account');
            else if( !!e.innerText.match(/zugang|einrichten|anlegen|eintritt/i)?.[0] )
              e.classList.add('esc-create-account');
          }
        },
    },
    {
      selector: ':is(.jqx-grid-group-collapse,.jqx-grid-group-expand)+.jqx-grid-group-cell',
      className: 'grouped-line',
      callback: function(e){
          if( e.innerText.indexOf('FT_Support_TZ-Digital') >= 0 ) 
            e.classList.add('support');
        },
    },
    {
      selector: ':not(:is(.jqx-grid-group-collapse,.jqx-grid-group-expand))+.jqx-grid-group-cell',
      callback: function(e){
          const p = e.parentNode;
          if( !!p.innerText.match(/escenic/i)?.[0] 
              && !!p.innerText.match(/zugang|einrichten|anlegen|eintritt|passwort/i)?.[0] )
            e.classList.add('esc-create-account');
        },
    },
  ]);

  // ================================================
  console.log('onLoad() finished successfully');
  console.groupEnd();
});
