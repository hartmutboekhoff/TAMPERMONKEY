(function(){
  window.addEventListener('load',()=>{
    
    
    // ================================================
    console.log('initializing shortcut-keys');
    //window.addKeyHandler('Space',ev=>alert('key pressed'));
  
  
    // ================================================
    console.log('initializing read-out elements');
    //window.registerForReadOut('selector');
    

    // ================================================
    console.log('initializing mutation-reactions');
    //window.onMutation('selector', reaction);
    window.onMutation('[data-a-popover]', {
      runOnLoad: true,
      callback: function(element,index) {
        try {
          const po = JSON.parse(element.dataset.aPopover);
          if( po.activate == 'onmouseover' ) {
            po.activate = 'onclick';
            element.dataset.aPopover = JSON.stringify(po);
          }
        }
        catch(err){
          console.log('popover', err);
        }
      }
    })
  
  
    // ================================================
    

  });
})();