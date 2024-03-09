(function(){

  const issueKeyToDate = {
    pattern: /(?:\[#)?(\d{4})(\d{2})(\d{2})-(\d{4})\]?/,
    replacement: 'vom $3.$2.$1, Nr. $4',
  };

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
	function readTicketInfo() {
    window.ReadOut.queueSelector('a.hyperLinkObjectId span.labelObjectId', {replace: issueKeyToDate})
                  .queueSelector('.labelSubject')
                  .queueSelector('#tbSimpleObjectSearchContact',{replace:{pattern:/^(.*),(.*),(.*)$/, replacement:'von $2 $1, $3'}});
	}
	
	function addSendMailButton() {
	  function getContactInfo(fieldId) {
	    const rx = /^([^,]+), *([^,]+), *([\w\.-_+]+@[\w\.-_+]+)$/;
	    return document.getElementById(fieldId)?.value?.match(rx)?.slice(1) ?? [];
	  }
	  function getRecipients() {
	    const customer = getContactInfo('tbSimpleObjectSearchContact');
	    return 'helpline@funkemedien.de' + (customer[2] != undefined? ';'+customer[2] : '');
	  }
	  function getSubject() {
	    return document.getElementById('tbTextBoxBezugsnummermitTag')?.value
	           + document.getElementById('tbTextBoxSubject')?.value;
	  }
	  function getBody() {
	    const customer = getContactInfo('tbSimpleObjectSearchContact');
	    return customer.length > 1? `Hallo ${customer[1]} ${customer[0]},\n\n` : 'Hallo,\n\n';
	  }

	  const copyButton = document.getElementById('menuCopyLinkToClipboard');
	  if( copyButton == undefined ) return;
	  let sendMailButton = document.getElementById('HBo_sendMailButton');
	  if( sendMailButton != undefined ) return;
	  sendMailButton = document.createElement('a');
	  sendMailButton.id = 'HBo_sendMailButton';
	  sendMailButton.innerText = 'E-Mail';
	  sendMailButton.href = 'mailto:'+encodeURIComponent(getRecipients())
	                        +'?subject='+encodeURIComponent(getSubject())
	                        +'&body='+encodeURIComponent(getBody());
	  copyButton.before(sendMailButton);
	}
	function addAssignToButton(buttonId, buttonText, groupName, userName) {
		if( document.getElementById(buttonId) != undefined ) 
		  return undefined;
		
		let innerDiv = document.querySelector('div#custom-assign-buttons div');
		if( innerDiv == undefined ) {
		  const outerDiv = document.createElement('div');
		  outerDiv.id = 'custom-assign-buttons';
		  innerDiv = document.createElement('div');
		  outerDiv.appendChild(innerDiv);
  		document.getElementById('GroupBoxAssignment')?.appendChild(outerDiv);
		}

		const button = document.createElement('button');
		button.id = buttonId;
		button.innerText = buttonText;
		button.onclick = ev=>assignToUser(groupName, userName);

		innerDiv.appendChild(button);
	}

  window.addEventListener('load',()=>{
    console.group('greasemonkey')
    
    // ================================================
    console.log('initializing shortcut-keys');
    window.addKeyHandler('F2',readTicketInfo,{excludeFormFields:false});

    
    // ================================================
    console.log('initializing read-out elements');
    
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
    //     �: \xc4
    //     �: \xd6
    //     �: \xdc
    //     �: \xe4
    //     �: \xf6
    //     �: \xfc
    //     �: \xdf

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
      	  addAssignToButton('assign-to-current-user', 'mir zuweisen', 'FT_Support_TZ-Digital', 'Boekhoff, Hartmut');
      	  addAssignToButton('assign-to-digital_frontend', 'Digital Frontend', 'Digital_Frontend');
/*
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
*/
      	}
      },
      '#ButtonGeloest': {
        listeners: {
          click: ()=>(setTimeout(()=>document.getElementById('TabPageSolutionItem_Header')?.click(),1000),
                      setTimeout(()=>document.getElementById('ComplexTextSolutionTextHtmlEditor_ExtenderContentEditable')?.focus(),2000)),
        }
      },
      ['.no-local-login-identity-provider-container']: {
        runOnLoad: true,
        callback: e=>{
          [...e.children].forEach(d=>{
            if( /funke/i.test(d.innerText) ) 
              d.classList.add('ok-button')
          });
        },
      },
    });
    
    //=================================
    addSendMailButton();

    // ================================================
    // horizontal scrolling for tab-headers
    [...document.querySelectorAll('.tabControlHeaderContainer')]
      .forEach(c=>
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