(function(){
  function toggle(id) {
    const cb = document.getElementById(id);
    cb.checked = !cb.checked;
    cb.dispatchEvent(new Event('change',{bubbles:true,cancelable:true}));
  }
  function readCheckboxStatus(cb) {
    const onoff = cb.checked? '' : 'don\'t ';
    const label = document.querySelector('label[for="'+cb.id+'"]').innerText.match(/Really run \"(.*)\" commands/)?.[1];
    if( label != undefined )
      window.ReadOut.queue(onoff+label, {language:'en-US',rate:4});
  }

  window.addEventListener('load',()=>{
    document.getElementById('file').setAttribute('accept','.xlsx,.xlsm');
    [...document.querySelectorAll('input[type="checkbox"]')]
      .forEach(cb=>cb.addEventListener('change',ev=>console.log(ev.constructor.name,readCheckboxStatus(ev.target))));
    
    if(location.hostname == 'esc-pub-tools-uat.cloud.funkedigital.de' )
      document.body.classList.add('uat');
    
    // ================================================
    console.log('initializing shortcut-keys');

    window.addKeyHandler('Digit1', ()=>toggle('allowInsertingUsers'),{excludeFormFields:false});
    window.addKeyHandler('Numpad1',()=>toggle('allowInsertingUsers'),{excludeFormFields:false});

    window.addKeyHandler('Digit2', ()=>toggle('allowUpdatingUsers'),{excludeFormFields:false});
    window.addKeyHandler('Numpad2',()=>toggle('allowUpdatingUsers'),{excludeFormFields:false});

    window.addKeyHandler('Digit3', ()=>toggle('allowUpdatingPasswords'),{excludeFormFields:false});
    window.addKeyHandler('Numpad3',()=>toggle('allowUpdatingPasswords'),{excludeFormFields:false});

    window.addKeyHandler('Digit4', ()=>toggle('allowUpdatingGroups'),{excludeFormFields:false});
    window.addKeyHandler('Numpad4',()=>toggle('allowUpdatingGroups'),{excludeFormFields:false});

    // ================================================

    document.getElementById('file').focus();
    
  });
})();