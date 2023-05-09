(function(){
  function tryCatchIgnore(fn, thisArg, ...args) {
    try {
      return fn.apply(thisArg, args);
    }
    catch(e) {
      // ignore
    }
  }
  function ifExists(element, fn) {
    if( typeof element == 'string' ) element = document.querySelector(element);
    return element == undefined? undefined : tryCatchIgnore(fn, this, element);
  }
  
  window.addEventListener('load',ev=>{
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
      
  }); // load
})();