(function(){
  window.addEventListener('load',()=>{

    function setFunkeKeyPrefix(inputField) {
      if( inputField?.value == ''  ) {
        inputField.value = 'vgzm.1020093-';
        inputField.focus();
      }
    }

    setFunkeKeyPrefix(document.getElementById('search-pixel_search_criteria_privatePixelUIDFieldPublisher'));

    // ================================================
    console.log('initializing mutation-reactions');
    window.onMutation('search-pixel_search_criteria_privatePixelUIDFieldPublisher', {
      callback:e=>setFunkeKeyPrefix(e),
    });
    
    // ================================================
    
    
  });
});