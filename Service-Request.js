// ==UserScript==
// @name     WebDesk Service-Request
// @version  1
// @grant    none
// @include		https://helpline.funkemedien.de/webdesk/webforms/*
// ==/UserScript==




const KeyHandlers = new (function() {
  function KeyHandler(key1) {
  	const Modifiers = ['','Ctrl', 'Alt', 'Shift', 'Ctrl+Alt', 'Ctrl+Shift', 'Alt+Shift', 'Ctrl+Alt+Shift'];
  	const f = function(e){console.debug((key1||'')+e.code+' unhandled');}
  	
  	Modifiers.forEach(m=>this[m]=f);
  }
  function KeyHandlerMap(key1) {
  	this._map = {};
  	this.get = function(k) {
  		var h = this._map[k];
  		if( h == undefined )
  			this._map[k] = h = new KeyHandler(key1);
  		return h;
  	}
  }  
	function getKeyCode(code) {
		let keys = code.split('+');
		if( keys.length == 1 )
			return { key: code, modifiers: '', fullCode: code};
			
		let modifiers = [];
		for( let i = 0 ; i < keys.length - 1 ; i++ ) {
			switch( keys[i].toLowerCase() ) {
				case 'ctrl' :
					modifiers[0] = 'Ctrl+'; break;
				case 'alt' :
					modifiers[1] = 'Alt+'; break;
				case 'shift' :
					modifiers[2] = 'Shift+'; break;
			}
		}
		return { key: keys[keys.length-1],
						 modifiers: modifiers.join('').slice(0,-1),
						 fullCode: code,
					 };
	}
	
	let handlermap = new KeyHandlerMap('');
	let level2HandlerMap = undefined;
	let level2HandlerTimeout = undefined;

	//this.add = function(handler, k, shift, ctrl, alt) {
	//this.add = function(key1[,key2],handler) {
	this.add = function() {
		function addL1Handler(k,handler) {
			let code = getKeyCode(k);
			handlermap.get(code.key)[code.modifiers] = handler;
		}
		function addL2Handler(k1,k2,handler) {
			let code1 = getKeyCode(k1);
			let code2 = getKeyCode(k2);
			let L1map = handlermap.get(code1.key)
			let L2map = L1map[code1.modifiers];
			if( typeof L2map == 'function' ) {
				L1map[code1.modifiers] = L2map = 
						new KeyHandlerMap('Sequence '+code1.fullCode+', ');
			}
			L2map.get(code2.key)[code2.modifiers] = handler;
		}
		
		if( arguments.length == 2 )
			addL1Handler(...arguments);
		else
			addL2Handler(...arguments);
	}
	this.dispatch = function(ev) {
		let modifiers = '';
		if( ev.ctrlKey == true ) modifiers = 'Ctrl+';
		if( ev.altKey == true ) modifiers += 'Alt+';
		if( ev.shiftKey == true ) modifiers += 'Shift+';
		if( modifiers != '' ) modifiers = modifiers.slice(0,-1);
		
		if( level2HandlerMap != undefined ) {
			let h = level2HandlerMap.get(ev.code)[modifiers]
			window.clearTimeout(level2HandlerTimeout);
			level2HandlerMap = undefined;
			level2HandlerTimeout = undefined;
			h(ev);
		}
		else {
			let h = handlermap.get(ev.code)[modifiers];
			if( typeof h == 'function' ) {
					h(ev);
			}
			else {
				level2HandlerMap = h;
				level2HandlerTimeout = window.setTimeout(()=>level2HandlerMap=level2HandlerTimeout=undefined,1500);
			}
		}
		return false;
	}
})();

function addStyles(newStyles) {
  const s = document.createElement('style');
  s.innerHTML = newStyles;
  document.getElementsByTagName('head')[0].appendChild(s);
}

const MaxAttempts = 10;

function waitForValue(f, maxAttempts) {
  if( Number.isInteger(maxAttempts) || maxAttempts == 0 ) 
    maxAttempts = maxAttempts || -1;
 
  return new Promise((resolve,reject)=>{
    const timer = window.setInterval(()=>{
      try {
        const val = f();
        if( val == undefined && --maxAttempts != 0 )
          return;

        window.clearInterval(timer);

        if( val != undefined )
          resolve(val);
        else
          reject('MaxAttempts exceeded');
      }
      catch(e) {
        if( --maxAttempts == 0 )
          reject(e);
      }
    }, 500);
  });
}
function getValue(selector, attribute) {
  const elem = window.document.querySelectorAll(selector)[0];
  if( elem == undefined ) return undefined;
  return attribute != undefined? elem[attribute] : elem;
}
function getValueIfNotEmptyString(selector,attribute) {
  const val = getValue(selector, attribute);
  return val == '' ? undefined : val;
}



function abortReading() {
  UtteranceQueue.length = 0;
  UtteranceHistoryQueue.length = 0;
  window.speechSynthesis.cancel();
}
function speakNextUtterance() {
  if( UtteranceQueue.length > 0 ) 
    window.speechSynthesis.cancel();
}
function speakPreviousUtterance() {
  if( UtteranceHistoryQueue.length > 1 && 
      ( window.speechSynthesis.speaking || window.speechSynthesis.paused ) ) {
    const repeat = UtteranceHistoryQueue.splice(-2, 2);
    UtteranceQueue.splice(0, 0, ...repeat)
    window.speechSynthesis.cancel();
  }
  
  if( UtteranceQueue.length > 0 ) 
    window.speechSynthesis.cancel();
}
function pauseResumeReading() {
  if(window.speechSynthesis.paused )
    window.speechSynthesis.resume();
  else if( window.speechSynthesis.speaking )
    window.speechSynthesis.pause();
  else if( typeof readAloud == 'function' )
    readAloud(true);
}

const UtteranceQueue = [];
const UtteranceHistoryQueue = [];
function queueUtterances(...texts) {
  function readNext() {
    const u = UtteranceQueue.shift();
    UtteranceHistoryQueue.push(u);
    if( u != undefined ) {
      u.onend = readNext;
      window.speechSynthesis.speak(u);
     }
  }

  UtteranceQueue.push(...texts.filter(t=>t!='').map(t=>{
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'de-DE';
    
    return u;
  }));
  readNext();
}

function showUserView() {
  const oid = location.search.match(/\bOBJECTID=(\d*)/);
  const odefid = location.search.match(/\bOBJECTDEFID=(\d*)/);
  const url = 'https://helpline.funkemedien.de/helpLinePortal/en-US/App/Cases/Detail/' + oid[1] + '/' + odefid[1];
  window.open(url);
}

window.addEventListener("load", ()=>{
  document.addEventListener('keydown', e=>KeyHandlers.dispatch(e));

  KeyHandlers.add('Escape', abortReading);
  KeyHandlers.add('Tab', speakNextUtterance);
  KeyHandlers.add('Shift+Tab', speakPreviousUtterance);
  KeyHandlers.add('Ctrl+Space', pauseResumeReading);

  KeyHandlers.add('Ctrl+NumpadDecimal',showUserView);
  
});

console.log('hbo running','no Syntax Errors', 'global');







const NewStyles = 
 'div.tabControlHeader span  {'
+'  background-color: #4cf;'
+'  padding: 0.2em 1em;'
+'  margin-right: 0.5em;'
+'  font-size: 1.5em'
+'}'
+'div.tabControlHeader span.selected  {'
+'  background-color: #1e8;'
+'  color: #000;'
+'  font-weight: bold'
+'}'
+'div.tabControlHeader {'
+'  background-color: #fff;'
+'  border-bottom: 3px solid #4cf;'
+'}'
+'input#DateTimeControlREGISTRATIONTIMEcalendarTB, input#TextBoxSubject {'
+'  font-size: 1.2em;'
+'  font-weight: bold'
+'}'
+'#upCheckBoxSUPUBLISHED>span, '
+'#upCheckBoxPUBLISHED>span {'
+'  background-color: red;' 
+'  padding: 2px 10px;' 
+'}'
+'#upCheckBoxSUPUBLISHED label, '
+'#upCheckBoxPUBLISHED label {'
+'  color: white;' 
+'  font-weight: bold;' 
+'}'
+'#LabelSUPublished, '
+'  color: white;' 
+'  font-weight: bold;' 
+'}'
;


function getAuthor() {
  const authorRegEx = /(.*?), (.*), ([^ ]*)/;
  const author = document.getElementById('TextBoxRequesterOverview').value;
  const match = author.match(authorRegEx);
  if( match.length>=3 )
    return { author: match[2] + ' ' + match[1],
             name: match[1].trim(),
             firstName: match[2].trim(),
             eMail: match[3].trim() 
           };
  else
    return { author: author, name: author };
}
function getDate() {
  return document.getElementById('DateTimeControlREGISTRATIONTIMEcalendarTB').value.slice(0,16);
}
function getTitle() {
  return document.getElementById('TextBoxSubject').value;
}
async function getDescription() {
  return await waitForValue(()=>getValueIfNotEmptyString('div.helpLineComplexTextLabel','innerText'),MaxAttempts);
}


function gotoTab(selector) {
  const tab = document.querySelectorAll(selector)[0];
  if( tab != undefined ) tab.click();
}
function gotoTabN(n) {
  const tabBar = document.querySelectorAll('div.tabControlHeaderContainer div.tabControlHeader')[0];

  if( tabBar.children[n] != undefined ) 
    tabBar.children[n].click();
}
function scrollTabControlBar(e) {
  let pos = this.parentElement.scrollLeft + e.deltaY;
  pos = pos<0 ? 0 : pos>this.parentElementScrollLeftMax ? this.parentElementScrollLeftMax : pos;
  this.parentElement.scrollLeft = pos;
}

function readAloud(withHint) {
  const selected = [...document.querySelectorAll('div.tabControlHeader>span')].filter(e=>e.className=='selected');
  if( selected.length == 0 ) return;
  switch( selected[0].id ) {
    case 'TabPageGeneralItem_Header':
      readStatusAloud();
      queueUtterances('Kontaktinformation');
      readContactInfoAloud();
      break;
    case 'TabPageDescriptionItem_Header': 
      readDescriptionAloud();
      break;
    case 'TabPageOverviewItem_Header': 
      readOverviewAloud();
      break;
      
    default:
      if( withHint == true ) 
        queueUtterances('Die Vorlesefunktion ist für diesen Reiter leider nicht verfügbar.');
  }
}
async function readOverviewAloud() {
  function getRawText(sitr) {
    const rows = sitr.querySelectorAll("td+td tr");
    for( let r of rows ) {
      if( r.children[0].innerText == 'Rohtext' )
        return r.children[1].innerText || '';
    }
    return '';
  }
  function getFormattedText(sitr) {
  return [...sitr.children[1].children]
               .slice(1)
               .map(e=>e.innerText)
               .filter(t=>t.match(/[a-zA-Z0-9ßäöüÄÖÜ]/)!=undefined)
               .join(', ');
  }
  
  let text = await waitForValue(()=>getValueIfNotEmptyString('#CaseOverview span.ovDescription','innerText'),10);
  const subitems = [...document.querySelectorAll('#CaseOverview div.ovSUItem>table>tbody>tr')]
                     .map(sitr=>{
                       const msg = getRawText(sitr) + getFormattedText(sitr);
                       if( msg == '' ) return '';
                         
                       let txt = sitr.children[0].innerText + '. Kommentar: ';
                       const innerTbody = sitr.children[1].children[0].children[0];
                       txt += innerTbody.children[0].children[1].innerText + ' ';
                       txt += innerTbody.children[1].children[1].innerText.slice(0,-3) + ', ';
                       return txt + msg;
                     });
  queueUtterances(text, ...subitems.reverse(),'Keine weiteren Kommentare.');
}
function readDescriptionAloud() {
  Promise.allSettled([getTitle(),getDate(),getAuthor(),getDescription()])
    .then(r=>{
      queueUtterances( r[0].value,
                       ', erstellt am: ' + r[1].value,
                       ', von: ' + r[2].value.author,
                       r[3].value );
    });
}
function readStatusAloud() {
  let  text = 'Ticketstatus: ' + getValue('#ComboBoxINTERNALSTATEtb','value')
               + ', Priorität: ' + getValue('#ComboBoxPrioritytb','value')
               + ', Team: ' + getValue('#ComboBoxTeamtb', 'value');
  const editor = getValue('#ComboBoxTeamMembertb','value');
  if( editor != '<Bitte wählen>')
    text += ', Bearbeiter: ' + editor;

  text += ', Erstellt am: ' + getDate()
          + ', Von: ' + getAuthor().author;
  
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'de-DE';
console.log(utter.lang,utter);
      window.speechSynthesis.speak(utter);
}
function readContactInfoAloud() {

  gotoTabN(0);
  Promise.allSettled([
    getAuthor(),
    waitForValue(()=>getValue('#TextBoxPhoneNumber','value'),MaxAttempts)
  ]).then(results=>{
    const eMail = results[0].value.eMail
                    .replaceAll(/\b/g, ' ')
                    .replaceAll('.', 'Punkt')
                    .trim()
                    .replace(/Punkt (.)(.)$/,'Punkt $1 $2');
console.log('"' + eMail+'"');
    const phone = (results[1].value=='')? 'Keine Telefonnummer.' : 'Telefon: ' + results[1].value.replace(/\+49\)?/, '0').replaceAll(/[)-]/g, ', ').replaceAll(/(.)/g,'$1 ').replaceAll(/ ([ ,])/g, '$1');
    
    queueUtterances(results[0].value.author, eMail, phone);
  });
}


window.addEventListener("load", ()=>{
  addStyles(NewStyles);

  gotoTab('#TabPageDescriptionItem_Header');
  
  document.querySelectorAll('div.tabControlHeader')[0].addEventListener('wheel',scrollTabControlBar);

  KeyHandlers.add('Shift+Space', readStatusAloud);
  KeyHandlers.add('Ctrl+Shift+Space', readContactInfoAloud);

console.log('adding numpad handlers');
  KeyHandlers.add('Ctrl+Numpad0',(e)=>(gotoTabN(0),e.preventDefault()));
  KeyHandlers.add('Ctrl+Numpad1',(e)=>(gotoTabN(1),e.preventDefault()));
  KeyHandlers.add('Ctrl+Numpad2',(e)=>(gotoTabN(2),e.preventDefault()));
  KeyHandlers.add('Ctrl+Numpad3',(e)=>(gotoTabN(3),e.preventDefault()));
  KeyHandlers.add('Ctrl+Numpad4',(e)=>(gotoTabN(4),e.preventDefault()));
  KeyHandlers.add('Ctrl+Numpad5',(e)=>(gotoTabN(5),e.preventDefault()));
  KeyHandlers.add('Ctrl+Numpad6',(e)=>(gotoTabN(6),e.preventDefault()));
  KeyHandlers.add('Ctrl+Numpad7',(e)=>(gotoTabN(7),e.preventDefault()));
  KeyHandlers.add('Ctrl+Numpad8',(e)=>(gotoTabN(8),e.preventDefault()));
  KeyHandlers.add('Ctrl+Numpad9',(e)=>(gotoTabN(9),e.preventDefault()));
  
  readDescriptionAloud();
  
});

console.log('hbo running','no Syntax Errors', 'Service-Request');
