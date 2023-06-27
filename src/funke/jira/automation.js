(function(){
  function tryCatchIgnore(fn, thisArg, ...args) {
    try {
      return fn.apply(thisArg, args);
    }
    catch(e) {
      // ignore
    }
  }
  function ifExists(element, thisArg, fn) {
    if( typeof element == 'string' ) element = document.querySelector(element);
    if( fn == undefined && typeof thisArg == 'function' ) [fn,thisArg] = [thisArg,fn];
    return element == undefined? undefined : tryCatchIgnore(fn, thisArg, element);
  }
  
  function bulkEdit(ev) {
    [...document.querySelectorAll('form#bulkedit input[type=checkbox][name^=bulkedit]')].forEach(cb=>cb.checked=true);
    
    ifExists('form#bulk-delete-notifications input#sendBulkNotificationCB',
             cb=>{
               cb.checked=false;
               document.querySelector('form#bulk-delete-notifications input#next')?.click();
             });
    
    ifExists('input#acknowledge_submit', 
             btn=>{
               window.ReadOut.read('Fertig!',{volume:2000});
               setTimeout(()=>btn.click(), 2000);
             });
         
  }
  function newIssue(ev) {
    ifExists('textarea#customfield_14307',ta=>{
      console.log(ta);
      if( ta.value == '' ) ta.value = '-';
    });
  }
  
  window.addEventListener('load',ev=>{
    bulkEdit();
    newIssue();
  }); // load
})();