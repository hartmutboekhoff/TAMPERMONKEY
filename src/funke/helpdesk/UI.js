(function(){
	function assignToUser(teamname, username,retry=0) {
		function recursion(until) {
			if( retry < until ) 
				setTimeout(()=>assignToUser(teamname, username,++retry), 500);
		}
		
		console.log('assigning to '+username, 'Team: '+teamname, 'Attempt: '+retry);
		if( document.getElementById('ComboBoxTeamtb')?.value != teamname ) {
			const team = [...document.getElementById('ComboBoxTeamlb').childNodes].find(e=>e.innerText==teamname);
			if( team != undefined ) {
				team.click();
				recursion(5);
			}
		}
		else if( document.getElementById('ComboBoxTeamMembertb')?.value != username ) {
			const user = [...document.getElementById('ComboBoxTeamMemberlb').childNodes].find(e=>e.innerText==username);
			if( user != undefined )
				user.click();
			else 
				recursion(10);
		}
	}
	
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
    window.registerForReadOut('#ComplexTextDescription',
                              { exclude:'textarea,div.helpLineComplexTextLabel>table',
                                childElements: {
                                  ['table[summary^="Email signature"]']: {
                                    extract: node=>node.querySelector('div>div>p'),
                                  },
                                }
                              });
    window.registerForReadOut('.tabControlHeader span');
    // Zeile im Reiter für reservierte Aufgaben.
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
                                    //suffix:'aktiviti 4',
                                  	extract: node=>node.innerText.replace(/SU\s+(\d+) \((?:Editor|Bearbeiter): (.*?)\)/,'Nummer $1 von $2'),
                                  },
                                  '[id^="PanelContentSUControlEDITOR"]': {
                                    extract: node=>node.querySelector('.SUControlItemValue')?.innerText,
                                  },
                                }
                             });

    window.registerForReadOut('#tbSimpleObjectSearchContact,#tbSimpleObjectSearchOpenedBy');

    window.registerForReadOut('#DateTimeControlREGISTRATIONTIMEcalendarTB');
    window.registerForReadOut('a.hyperLinkObjectId span.labelObjectId, input#tbTextBoxBezugsnummermitTag',
                              { replace: issueKeyToDate}
                             );


    // ================================================
    //  Umlaute werden wie folgt codiert:
    //     Ä: \xc4
    //     Ö: \xd6
    //     Ü: \xdc
    //     ä: \xe4
    //     ö: \xf6
    //     ü: \xfc
    //     ß: \xdf

    console.log('initializing mutation-reactions');
    window.onMutation({
      ['MAT-ROW.mat-row']: {
        callback: e=>{
            if( !!e.innerText.match(/escenic/i)?.[0] ) {
              if( !!e.innerText.match(/l\xf6sch|austritt|freistellung/i)?.[0] )
                e.classList.add('esc-delete-account');
              else if( !!e.innerText.match(/zugang|einrichten|anlegen|eintritt/i)?.[0] )
                e.classList.add('esc-create-account');
            }
          },
      },
      [':is(.jqx-grid-group-collapse,.jqx-grid-group-expand)+.jqx-grid-group-cell']: {
        className: 'grouped-line',
        callback: function(e){
            if( e.innerText.indexOf('FT_Support_TZ-Digital') >= 0 ) 
              e.classList.add('support');
          },
      },
      [':not(:is(.jqx-grid-group-collapse,.jqx-grid-group-expand))+.jqx-grid-group-cell']: {
        callback: function(e){
            const p = e.parentNode;
            if( !!p.innerText.match(/escenic/i)?.[0] 
                && !!p.innerText.match(/zugang|einrichten|anlegen|eintritt|passwort|login/i)?.[0] )
              e.classList.add('esc-create-account');
            if( !!e.innerText.match(/Boekhoff, Hartmut/i)?.[0] )
              e.classList.add('assigned-to-me');
          },
      },
      ['div#GroupBoxAssignment']: {
      	runOnLoad: true,
      	callback: function(e){
      		if( document.getElementById('assign-to-current-user') != undefined ) return;
      		const outerDiv = document.createElement('div');
      		outerDiv.id='assign-to-current-user';
      		const innerDiv = document.createElement('div');
      		const button = document.createElement('button');
					button.innerText = "mir zuweisen";
					button.onclick = ev=>assignToUser('FT_Support_TZ-Digital', 'Boekhoff, Hartmut');

      		innerDiv.appendChild(button);
      		outerDiv.appendChild(innerDiv);
      		e.appendChild(outerDiv);
      	}
      },
    });

    // ================================================
    // horizontal scrolling for tab-headers
    [...document.querySelectorAll('.tabControlHeaderContainer')].forEach(c=>
      c.addEventListener('wheel',ev=>{
        c.scrollLeft += ev.deltaY;
        ev.stopPropagation();
        ev.preventDefault();
      })
    );


    // ================================================
    // ================================================
    console.log('onLoad() finished successfully');
    console.groupEnd();
  });
})();