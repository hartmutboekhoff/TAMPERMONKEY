(function(){
  window.addKeyHandler('Ctrl+Space',ev=>focusKeyInput());

  window.addEventListener('load',()=>{

    const KeyInputField = 'search-pixel_search_criteria_privatePixelUIDFieldPublisher';

    function setFunkeKeyPrefix(inputField) {
      if( inputField?.value == ''  ) {
        inputField.value = 'vgzm.1020093-';
        inputField.focus();
      }
    }
    function focusKeyinput() {
      document.getElementById(KeyInputField)?.focus();
    }

    setFunkeKeyPrefix(document.getElementById(KeyInputField));
    // ================================================
    console.log('initializing shortcut-keys');
    window.addKeyHandler('Ctrl+Space',ev=>focusKeyInput());
  
    // ================================================
    console.log('initializing mutation-reactions');
    window.onMutation(KeyInputField, {
      callback:e=>setFunkeKeyPrefix(e),
    });
    
    // ================================================
    
    
  });
});