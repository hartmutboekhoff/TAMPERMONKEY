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

    [...document.getElementsByTagName('code')].forEach(el=>window.ReadOut.read(el.innerText.match(/fail|error/i) == undefined? 'Upload erfolgreich' : 'Fehler beim Upload'));
    
    
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
    
    window.addKeyHandler('Ctrl+Enter', ()=>document.querySelector('input[value="Upload"]').click(),{excludeFormFields:false,stopPropagation:true,preventDefault:true});
    window.addKeyHandler('Ctrl+NumpadEnter', ()=>document.querySelector('input[value="Upload"]').click(),{excludeFormFields:false,stopPropagation:true,preventDefault:true});
    
    // ================================================

    document.getElementById('file').focus();
    
  });
})();