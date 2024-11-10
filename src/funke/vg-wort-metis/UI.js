(function(){
  window.addEventListener('load',()=>{
    function setFunkeKeyPrefix() {
      console.log('trying to set key-prefix');
      const inputField = document.getElementById('search-pixel_search_criteria_privatePixelUIDFieldPublisher');
      if( inputField?.value == ''  ) {
        inputField.value = 'vgzm.1020093-';
        inputField.focus();
      }
    }

    // ================================================
    console.log('initializing mutation-reactions');
    window.onMutation('search-pixel_search_criteria_privatePixelUIDFieldPublisher', {
      callback:setFunkeKeyPrefix,
      runOnLoad: true,
    });
    
    // ================================================

    setFunkeKeyPrefix();
  });
})();

