// ==UserScript==
// @name     Webdesk Task
// @version  1
// @grant    none
// @include  https://helpline.funkemedien.de/webdesk/task/*
// ==/UserScript==


const NewStyles = 
 'input#vm.Sys.Subject {'
+'  font-size: 1.2em;'
+'  font-weight: bold'
+'}'
;


function waitForValue(f, maxAttempts) {
  if( Number.isInteger(maxAttempts) || maxAttempts == 0 ) 
    maxAttempts = maxAttempts || -1;

  
  return new Promise((resolve,reject)=>{
    const timer = window.setInterval(()=>{
      const val = f();
      if( val == undefined && --maxAttempts != 0 )
        return;

      window.clearInterval(timer);

      if( val != undefined )
        resolve(val);
      else
        reject('MaxAttempts exceeded');

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
function stopReading() {
  window.speechSynthesis.cancel();
}




window.addEventListener("load", ()=>{
  const s = document.createElement('style');
  s.innerHTML = NewStyles;
  document.getElementsByTagName('head')[0]
    .appendChild(s);

  document.addEventListener('keydown',e=>{if(e.code == 'Escape') stopReading();});
  readAloud();
});

console.log('hbo running');