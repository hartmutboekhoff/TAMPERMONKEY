// ==UserScript==
// @name     Webdesk Task
// @version  1
// @grant    none
// @include  https://helpline.funkemedien.de/webdesk/task/*
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
  window.speechSynthesis.cancel();
}
function skipToNextReading() {
  if( UtteranceQueue.length > 0 ) window.speechSynthesis.cancel();
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
function queueUtterances(...texts) {
  function readNext() {
    const u = UtteranceQueue.shift();
    if( u != undefined ) {
      u.onend = readNext;
      window.speechSynthesis.speak(u);
     }
  }

  UtteranceQueue.push(...texts.map(t=>{
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'de-DE';
console.log(u.lang,u);
    
    return u;
  }));
  readNext();
}

function showUserView() {
  const oid = location.search.match(/\bOBJECTID=(\d*)/);
  const odefid = location.search.match(/\bOBJECTDEFID=(\d*)/);
  const url = 'https://helpline.funkemedien.de/helpLinePortal/en-US/App/Cases/Detail/' + oid[1] + '/' + odefid[1];
  console.log(url);
  window.open(url);
}

window.addEventListener("load", ()=>{
  document.addEventListener('keydown', e=>KeyHandlers.dispatch(e));
console.log('aaaaaaaaaaaa');
  KeyHandlers.add('Escape', abortReading);
  KeyHandlers.add('Tab', skipToNextReading);
  KeyHandlers.add('Ctrl+Space', pauseResumeReading);
console.log('aaaaaaaaaaaa');

  KeyHandlers.add('Ctrl+NumpadDecimal',showUserView);
  
});

console.log('hbo running','no Syntax Errors', 'global');





const NewStyles = 
 'input#vm.Sys.Subject {'
+'  font-size: 1.2em;'
+'  font-weight: bold'
+'}'
;


async function getAuthor() {
  return await waitForValue(()=>getValueIfNotEmptyString('#vm\\.Sys\\.Requester','innerText'),10);
}
async function getDate() {
  const DateRegEx = /(\d{4})(\d{2})(\d{2})/;
  try{
    const val = await waitForValue(()=>getValueIfNotEmptyString('#vm\\.Sys\\.Referencenumber','innerText'),10);
    const d = val.match(DateRegEx);
    return d[3] + '.' + d[2] + '.' + d[1];
   } catch(e) {
    throw e;
   }
}
async function getTitle() {
  return await waitForValue(()=>getValueIfNotEmptyString('#vm\\.Sys\\.Subject','value'),10);
}
async function getDescription() {
  return await waitForValue(()=>getValueIfNotEmptyString('#vm\\.Sys\\.Description','value'),10);
}

function readAloud() {
  Promise.allSettled([getTitle(), getDate(), getAuthor(), getDescription()])
    .then(r=>{
      const text = 'Aufgabe: ' + r[0].value + '.\n' 
                   + 'Erstellt am: ' + r[1].value + '\n'
                   + 'Von: ' + r[2].value + '\n\n'
                   + r[3].value;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'de-DE';
      window.speechSynthesis.speak(utter);
    });
}

window.addEventListener("load", ()=>{
  addStyles(NewStyles);

  readAloud();
});

console.log('hbo running');