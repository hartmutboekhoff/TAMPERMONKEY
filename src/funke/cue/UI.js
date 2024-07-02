(function(){
  
  function openTextContextMenu() {
    const b1 = document.activeElement
                       ?.closest("cue-storyline")
                       ?.querySelector("cue-storyline-selection > cue-auto-scroll > cue-mouse-handler > div.storyElements > cue-lazy-story-element-editor-container:nth-child(5) > cue-lazy-load > cue-story-element-editor-container > cue-mouse-handler > cue-lazy-load > cue-insert-menu > div > button");
    if( b1 ) {
      b1.click();
      setTimeout(()=>{
        const b2 = b1.closest('cue-insert-menu').querySelector('div > div > div.left > button');
        if( b2 )
          b2.click();
        else
          console.log('B2 nciht gefunden');
      }, 100);
    }
    else {
      console.log('B1 nicht gefunden');
    }
  }
  
  
  
  window.addEventListener('load',()=>{
    
   
    // ================================================
    console.log('initializing shortcut-keys');
    //window.addKeyHandler('Space',ev=>alert('key pressed'));
    window.addKeyHandler('Shift+ContextMenu', openTextContextMenu, {stopPropagation:true,preventDefault:true,excludeFormFields:false});
    
  
  
    // ================================================
    console.log('initializing read-out elements');
    //window.registerForReadOut('selector');
    

    // ================================================
    console.log('initializing mutation-reactions');
    //window.onMutation('selector', reaction);
  
  
    // ================================================


  });
})();