(function(){
  window.addEventListener('load',()=>{
    document.getElementById('file').setAttribute('accept','.xlsx,.xlsm');
    
    if(location.hostname == 'esc-pub-tools-uat.cloud.funkedigital.de' )
      document.body.classList.add('uat');
    
  function toggle(id) {
    document.getElementById(id).checked ^= true;
  }
  
  window.addKeyHandler('Digit1', ()=>toggle('allowInsertingUsers'),{excludeFormFields:false});
  window.addKeyHandler('Numpad1',()=>toggle('allowInsertingUsers'),{excludeFormFields:false});

  window.addKeyHandler('Digit2', ()=>toggle('allowUpdatingUsers'),{excludeFormFields:false});
  window.addKeyHandler('Numpad2',()=>toggle('allowUpdatingUsers'),{excludeFormFields:false});

  window.addKeyHandler('Digit3', ()=>toggle('allowUpdatingPasswords'),{excludeFormFields:false});
  window.addKeyHandler('Numpad3',()=>toggle('allowUpdatingPasswords'),{excludeFormFields:false});

  window.addKeyHandler('Digit4', ()=>toggle('allowUpdatingGroups'),{excludeFormFields:false});
  window.addKeyHandler('Numpad4',()=>toggle('allowUpdatingGroups'),{excludeFormFields:false});

  document.getElementById('file').focus();
    
  });
})();