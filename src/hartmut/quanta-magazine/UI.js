(function(){
  window.addEventListener('load',()=>{
    
    
    // ================================================
    console.log('initializing shortcut-keys');
    //window.addKeyHandler('Space',ev=>alert('key pressed'));
  
  
    // ================================================
    console.log('initializing read-out elements');
    //window.registerForReadOut('selector');
    window.registerForReadOut('#postBody', {
      language: 'en-US',
      exclude: 'figure,aside,.post__title__actions,h2.screen-reader-text',
    });
    window.registerForReadOut('.hero-title,.hero__card,.card', {
      language: 'en-US',
    });
    

    // ================================================
    console.log('initializing mutation-reactions');
    //window.onMutation('selector', reaction);
  
  
    // ================================================


  });
})();