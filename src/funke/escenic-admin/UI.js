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
    window.onMutation('body', {
      runOnLoad: true,
      callback: ()=>{
        function addOption(id,value,text) {
          const radio = document.createElement('input');
          radio.id = id;
          radio.type = 'radio';
          radio.name = 'typetmp';
          radio.value = value;
          radio.addEventListener('click',()=>document.getElementById('type').value=value);

          const label = document.createElement('label');
          label.setAttribute('for', id);
          label.innerText = text;
          
          document.getElementById('otherradio').before(radio,label,document.createElement('br'));
        }
        
        addOption('menuRadio', '/escenic/plugin/menu', 'Menu definition (optional)');
        addOption('shortcutRadio', '/unitb/shortcut-links', 'Shortcut-Url definition (optional)');
      }
    });

  
  // ================================================


  });
})();
